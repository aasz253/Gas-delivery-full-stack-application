const Shop = require('../models/Shop');
const Cylinder = require('../models/Cylinder');
const Post = require('../models/Post');

// Helper to create posts for shop media
const createMediaPosts = async (shopId, photos = [], videos = []) => {
  const photoPosts = photos.map(url => ({ shop: shopId, url, type: 'photo' }));
  const videoPosts = videos.map(url => ({ shop: shopId, url, type: 'video' }));
  if (photoPosts.length > 0 || videoPosts.length > 0) {
    await Post.insertMany([...photoPosts, ...videoPosts]);
  }
};

// @desc    Register a new shop
// @route   POST /api/shops
// @access  Private/Distributor
const registerShop = async (req, res) => {
  const { name, address, description, coordinates, whatsappNumber, contactNumber, photos, videos } = req.body;

  const shopExists = await Shop.findOne({ owner: req.user._id });

  if (shopExists) {
    res.status(400).json({ message: 'User already has a shop' });
    return;
  }

  const shop = await Shop.create({
    owner: req.user._id,
    name,
    address,
    description,
    whatsappNumber,
    contactNumber,
    location: {
      type: 'Point',
      coordinates,
    },
  });

  if (shop) {
    await createMediaPosts(shop._id, photos, videos);
    res.status(201).json(shop);
  } else {
    res.status(400).json({ message: 'Invalid shop data' });
  }
};

// @desc    Update current user's shop
// @route   PUT /api/shops/my-shop
// @access  Private/Distributor
const updateShop = async (req, res) => {
  const { name, address, description, coordinates, whatsappNumber, contactNumber, photos, videos } = req.body;

  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) {
    res.status(404).json({ message: 'Shop not found' });
    return;
  }

  shop.name = name || shop.name;
  shop.address = address || shop.address;
  shop.description = description || shop.description;
  shop.whatsappNumber = whatsappNumber || shop.whatsappNumber;
  shop.contactNumber = contactNumber || shop.contactNumber;
  
  if (coordinates) {
    shop.location = {
      type: 'Point',
      coordinates,
    };
  }

  const updatedShop = await shop.save();
  
  // Create new posts for newly uploaded media
  if ((photos && photos.length > 0) || (videos && videos.length > 0)) {
    await createMediaPosts(shop._id, photos, videos);
  }

  res.json(updatedShop);
};

// @desc    Get current user's shop
// @route   GET /api/shops/my-shop
// @access  Private/Distributor
const getMyShop = async (req, res) => {
  const shop = await Shop.findOne({ owner: req.user._id });

  if (shop) {
    const posts = await Post.find({ shop: shop._id }).sort('-createdAt');
    res.json({ ...shop._doc, posts });
  } else {
    res.status(404).json({ message: 'Shop not found' });
  }
};

// @desc    Add a cylinder to a shop
// @route   POST /api/shops/cylinders
// @access  Private/Distributor
const addCylinder = async (req, res) => {
  const { brand, size, price, stock, image } = req.body;

  const shop = await Shop.findOne({ owner: req.user._id });

  if (!shop) {
    res.status(404).json({ message: 'Shop not found' });
    return;
  }

  const cylinder = await Cylinder.create({
    shop: shop._id,
    brand,
    size,
    price,
    stock,
    image,
  });

  if (cylinder) {
    res.status(201).json(cylinder);
  } else {
    res.status(400).json({ message: 'Invalid cylinder data' });
  }
};

// @desc    Get cylinders for a shop
// @route   GET /api/shops/:shopId/cylinders
// @access  Public
const getShopCylinders = async (req, res) => {
  const cylinders = await Cylinder.find({ shop: req.params.shopId });
  res.json(cylinders);
};

// @desc    Get all shops (can be filtered by location)
// @route   GET /api/shops
// @access  Public
const getShops = async (req, res) => {
  const { lat, lng, distance = 10 } = req.query;

  let query = {};

  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        $maxDistance: distance * 1000, // distance in km
      },
    };
  }

  const shops = await Shop.find(query);
  res.json(shops);
};

// @desc    Get shop by ID
// @route   GET /api/shops/:id
// @access  Public
const getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    const posts = await Post.find({ shop: shop._id }).sort('-createdAt');
    res.json({ ...shop._doc, posts });
  } else {
    res.status(404).json({ message: 'Shop not found' });
  }
};

module.exports = {
  registerShop,
  updateShop,
  getMyShop,
  addCylinder,
  getShopCylinders,
  getShops,
  getShopById,
};
