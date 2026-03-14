const Order = require('../models/Order');
const Shop = require('../models/Shop');
const User = require('../models/User');
const { stkPush } = require('../utils/mpesa');
const { sendSMS, sendWhatsApp } = require('../utils/notifications');

// @desc    Create a new order and initiate payment
// @route   POST /api/orders
// @access  Private/Customer
const createOrder = async (req, res) => {
  const {
    shopId,
    items,
    deliveryLocation,
    phoneNumber,
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400).json({ message: 'No items in order' });
    return;
  }

  const shop = await Shop.findById(shopId).populate('owner');
  if (!shop) {
    res.status(404).json({ message: 'Shop not found' });
    return;
  }

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0) + 50; // Total including delivery
  const deliveryFee = 50; // Fixed delivery fee for STK Push

  const order = await Order.create({
    customer: req.user._id,
    shop: shopId,
    items,
    totalPrice,
    deliveryLocation: {
      type: 'Point',
      coordinates: deliveryLocation.coordinates,
      description: deliveryLocation.description,
      buildingPhoto: deliveryLocation.buildingPhoto,
    },
  });

  if (order) {
    // Notify distributor IMMEDIATELY of a PENDING order
    try {
      const mapsLink = `https://www.google.com/maps?q=${deliveryLocation.coordinates[1]},${deliveryLocation.coordinates[0]}`;
      const message = `New GasLink Order! (PAYMENT PENDING)
Customer: ${req.user.name}
Phone: ${phoneNumber}
Items: ${items.map(i => `${i.quantity}x Cylinder`).join(', ')}
Total: KES ${totalPrice}
Location: ${deliveryLocation.description}
Maps: ${mapsLink}

Please wait for payment confirmation before delivering.`;

      await sendSMS(shop.owner.phone, message);
      await sendWhatsApp(shop.owner.phone, message);
    } catch (err) {
      console.error('Failed to send immediate notification:', err.message);
    }

    // Initiate STK Push for ONLY the delivery fee
    try {
      const response = await stkPush(deliveryFee, phoneNumber, order._id.toString());
      res.status(201).json({ order, paymentResponse: response });
    } catch (error) {
      res.status(500).json({ message: 'Failed to initiate payment', error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Invalid order data' });
  }
};

// @desc    M-Pesa Callback to confirm payment
// @route   POST /api/payments/callback
// @access  Public
const mpesaCallback = async (req, res) => {
  const { Body } = req.body;
  const stkCallback = Body.stkCallback;

  if (stkCallback.ResultCode === 0) {
    const orderId = stkCallback.AccountReference; // This might need adjustment based on Callback data structure
    const order = await Order.findById(orderId).populate('shop customer');

    if (order) {
      order.paymentStatus = 'paid';
      
      // Handle different M-Pesa Callback formats
      const metadata = stkCallback.CallbackMetadata?.Item || [];
      
      order.paymentDetails = {
        CheckoutRequestID: stkCallback.CheckoutRequestID,
        MpesaReceiptNumber: metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value,
        TransactionDate: metadata.find(i => i.Name === 'TransactionDate')?.Value,
        PhoneNumber: metadata.find(i => i.Name === 'PhoneNumber')?.Value,
      };
      await order.save();

      // Notify distributor
      const distributor = await User.findById(order.shop.owner);
      const mapsLink = `https://www.google.com/maps?q=${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}`;
      const message = `New GasLink Order!
Phone: ${order.customer.phone}
Description: ${order.deliveryLocation.description}
Coordinates: ${order.deliveryLocation.coordinates[1]},${order.deliveryLocation.coordinates[0]}
Maps: ${mapsLink}
Photo: ${order.deliveryLocation.buildingPhoto}

DELIVERY FEE PAID VIA MPESA.
COLLECT KES ${order.totalPrice - 50} IN CASH ON DELIVERY.`;

      await sendSMS(distributor.phone, message);
      await sendWhatsApp(distributor.phone, message);
    }
  } else {
    // Handle payment failure
    console.error('Payment failed for order');
  }

  res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('customer shop items.cylinder');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc    Get distributor's orders
// @route   GET /api/orders/my-shop
// @access  Private/Distributor
const getMyShopOrders = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });
  if (!shop) {
    res.status(404).json({ message: 'Shop not found' });
    return;
  }
  const orders = await Order.find({ shop: shop._id }).populate('customer items.cylinder').sort('-createdAt');
  res.json(orders);
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Distributor
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate('shop');

  if (!order) {
    res.status(404).json({ message: 'Order not found' });
    return;
  }

  // Check if the user is the owner of the shop or an admin
  if (order.shop.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(401).json({ message: 'Not authorized to update this order' });
    return;
  }

  order.orderStatus = status;
  const updatedOrder = await order.save();
  res.json(updatedOrder);
};

module.exports = {
  createOrder,
  mpesaCallback,
  getOrderById,
  getMyShopOrders,
  updateOrderStatus,
};
