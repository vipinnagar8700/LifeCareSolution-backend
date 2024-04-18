const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        default: null
    },
    latitude: Number,
    longitude: Number,
    image: {
        type: String,
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
