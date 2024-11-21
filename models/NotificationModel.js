const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
  title: { type: String, required: true }, // Notification title
  body: { type: String, required: true }, // Notification body
  type: { type: String, enum: ['appointment', 'reminder', 'general'], default: 'general' }, // Type of notification
  sentAt: { type: Date, default: Date.now }, // Timestamp of when the notification was sent
  status: { type: String, enum: ['sent', 'failed'], default: 'sent' }, // Delivery status
  token: { type: String }, // Firebase notification token used for sending
  isRead: { type: Boolean, default: false }, // Read/Unread status
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }, // Reference to the patient
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the doctor
},
{
    timestamps: true, // This will automatically add `createdAt` and `updatedAt` fields
  });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
