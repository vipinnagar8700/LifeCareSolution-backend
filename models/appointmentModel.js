const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  slot_id: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
  videoSlot_id: { type: mongoose.Schema.Types.ObjectId, ref: "VideoSlot" },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'accept', 'cancel', 'completed'],
    required: true,
  },
  type: {
    type: String,
    default: 'General',
    enum: ['General', 'Video'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  invoice_id: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    default: null
  },
  LastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  pincode: {
    type: String,
    default: null
  },
 
}, {
  timestamps: true
});

// Middleware to handle post-save logic
appointmentSchema.post('save', async function (doc) {
  // Extract payment details and save in the Payment model
  const { patient_id, doctor_id, slot_id, videoSlot_id, date, type, amount,  } = doc;

});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
