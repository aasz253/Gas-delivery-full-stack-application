const express = require('express');
const router = express.Router();
const {
  registerShop,
  updateShop,
  getMyShop,
  addCylinder,
  getShopCylinders,
  getShops,
  getShopById,
} = require('../controllers/shopController');
const { protect, distributor } = require('../middleware/authMiddleware');

router.route('/').get(getShops).post(protect, distributor, registerShop);
router.route('/my-shop')
  .get(protect, distributor, getMyShop)
  .put(protect, distributor, updateShop);
router.route('/cylinders').post(protect, distributor, addCylinder);
router.route('/:id').get(getShopById);
router.route('/:shopId/cylinders').get(getShopCylinders);

module.exports = router;
