const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    items: [
      {
        cylinder: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Cylinder',
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    deliveryFee: {
      type: Number,
      required: true,
      default: 50,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    paymentDetails: {
      CheckoutRequestID: String,
      MpesaReceiptNumber: String,
      TransactionDate: String,
      PhoneNumber: String,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'delivering', 'completed', 'cancelled'],
      default: 'pending',
    },
    deliveryLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      buildingPhoto: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ deliveryLocation: '2dsphere' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
