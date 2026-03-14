const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Shop',
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['photo', 'video'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '7d' }, // Automatically deletes the document after 7 days
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
