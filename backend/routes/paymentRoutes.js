const express = require('express');
const router = express.Router();
const { mpesaCallback } = require('../controllers/orderController');

router.post('/callback', mpesaCallback);

module.exports = router;
