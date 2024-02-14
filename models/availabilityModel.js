const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  day: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'deactive',
    enum: ['deactive', 'active'],
    required: true,
  },
  from:{
    type: String,
    required: true,
  },
  to:{
    type: String,
    required: true,
  }
},{
  timestamps: true
});



const Availability = mongoose.model('Availability', availabilitySchema);

module.exports = Availability;
