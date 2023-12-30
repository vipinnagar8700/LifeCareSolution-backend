const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const appointmentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    doctor_id:{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    slot_id: { type: mongoose.Schema.Types.ObjectId, ref: "Slot" },
    date: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default:'pending',
        enum: ['pending', 'accept', 'cancel', 'completed'],
        required: true,
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Appointment', appointmentSchema);