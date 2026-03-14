const mongoose = require('mongoose');

const cylinderSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      enum: [6, 13, 22, 35, 45, 50],
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Cylinder = mongoose.model('Cylinder', cylinderSchema);

module.exports = Cylinder;
