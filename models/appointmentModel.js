const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const appointmentSchema = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true,
    },
    doctor_id: {
        type: String,
        required: true,
    },
    slot_id: {
        type: String,
        required: true,
    },
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