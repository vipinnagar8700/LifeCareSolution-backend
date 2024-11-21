const mongoose = require('mongoose');

// Define schema for ChatUsers relationships
const ChatUsersSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'cancelled'],
        default: 'pending'
    },
    lastSeen: {
        type: Date,
        default: null
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    unreadMessages: {
        type: Number,
        default: 0
    },
    lastMessage: { type: String },
});

// Define model for ChatUsers relationships
const ChatUsers = mongoose.model('ChatUsers', ChatUsersSchema);

module.exports = ChatUsers;
