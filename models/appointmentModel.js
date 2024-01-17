const mongoose = require('mongoose');
const Payment = require('../models/paymentModel')

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
  payment: {
    method: {
      type: String,
      enum: ['code', 'online'],
      required: true,
      default: 'code',
    },
    transactionId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    confirmationCode: {
      type: String,
      default: null,
    },
    timestamps: {
      created_at: {
        type: Date,
        default: Date.now(),
      },
      updated_at: {
        type: Date,
        default: null,
      },
    },
  },
}, {
  timestamps: true
});

// Middleware to handle post-save logic
appointmentSchema.post('save', async function (doc) {
  // Extract payment details and save in the Payment model
  const { patient_id, doctor_id, slot_id, videoSlot_id, date, type, amount, payment } = doc;

  const newPayment = await Payment.create({
    appointment_id: doc._id,
    method: payment.method,
    transactionId: payment.transactionId,
    status: payment.status,
    amount,
  });
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
