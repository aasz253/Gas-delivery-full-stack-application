const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer/Cloudinary Upload Error:', err);
      return res.status(500).json({ 
        message: 'Upload failed at storage layer', 
        error: err.message,
        details: err.http_code ? `Cloudinary error ${err.http_code}` : 'Check file format/size'
      });
    }
    
    if (req.file) {
      res.json({ url: req.file.path });
    } else {
      res.status(400).json({ message: 'No file provided in request' });
    }
  });
});

module.exports = router;
