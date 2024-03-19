const mongoose = require("mongoose");

// Define Activity Schema
const activitySchema = new mongoose.Schema({
    doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  type: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false // Initially, activities are marked as unread
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create Activity model
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;

