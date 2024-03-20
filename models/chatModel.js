const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: null,
  },
  image: {
    type: String,
    default: null,
  },
  isRead:{
    type:Boolean,
    default:false
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});


const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);
