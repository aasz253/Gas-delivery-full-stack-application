const User = require('../models/User');
const Shop = require('../models/Shop');
const Order = require('../models/Order');
const Post = require('../models/Post');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalDistributors = await User.countDocuments({ role: 'distributor' });
    const totalShops = await Shop.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalMedia = await Post.countDocuments();
    const successfulOrders = await Order.countDocuments({ orderStatus: 'completed' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    
    // Calculate total revenue from completed orders
    const completedOrders = await Order.find({ orderStatus: 'completed' });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name phone')
      .populate('shop', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalCustomers,
      totalDistributors,
      totalShops,
      totalOrders,
      totalMedia,
      successfulOrders,
      pendingOrders,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
};

// @desc    Get all shops
// @route   GET /api/admin/shops
// @access  Private/Admin
const getAllShops = async (req, res) => {
  const shops = await Shop.find({}).populate('owner', 'name email phone');
  res.json(shops);
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  const orders = await Order.find({})
    .populate('customer', 'name email phone')
    .populate('shop', 'name')
    .sort({ createdAt: -1 });
  res.json(orders);
};

// @desc    Get all active media posts
// @route   GET /api/admin/posts
// @access  Private/Admin
const getAllPosts = async (req, res) => {
  const posts = await Post.find({}).populate('shop', 'name').sort('-createdAt');
  res.json(posts);
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllShops,
  getAllOrders,
  getAllPosts
};
