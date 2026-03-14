const mongoose = require('mongoose');

const shopSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    photos: [{
      type: String,
    }],
    videos: [{
      type: String,
    }],
    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

shopSchema.index({ location: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
