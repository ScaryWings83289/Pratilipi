const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Middleware
const { dateFormatter } = require("../middlewares/content");

const ContentSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  story: {
    type: String,
    required: true,
    trim: true,
  },
  datePublished: {
    type: String,
    default: dateFormatter(Date.now()),
  },
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  }
});

const User = mongoose.model('Content_Service', ContentSchema);
module.exports = User;
