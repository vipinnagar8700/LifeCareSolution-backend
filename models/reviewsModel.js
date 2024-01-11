
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    comment: String,
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
  },{
    timestamps:true
  });

  module.exports = mongoose.model('Review', reviewSchema);