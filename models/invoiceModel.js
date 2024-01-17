const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  // ... other invoice-related fields
  appointment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true,
  },

  invoice_id: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});


const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
