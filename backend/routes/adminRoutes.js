const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllShops,
  getAllOrders,
  getAllPosts
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin-only
router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/shops', getAllShops);
router.get('/orders', getAllOrders);
router.get('/posts', getAllPosts);

module.exports = router;
