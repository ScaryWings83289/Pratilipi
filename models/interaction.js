const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InteractionSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  readBooks: {
    type: Array,
  },
  likedBooks: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const User = mongoose.model("Interaction_Service", InteractionSchema);
module.exports = User;
