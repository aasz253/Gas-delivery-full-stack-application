const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getMyShopOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, distributor } = require('../middleware/authMiddleware');

router.route('/').post(protect, createOrder);
router.route('/my-shop').get(protect, distributor, getMyShopOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/status').put(protect, distributor, updateOrderStatus);

module.exports = router;
