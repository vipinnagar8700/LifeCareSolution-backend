const mongoose = require('mongoose');

const favourateSchema = new mongoose.Schema({
    patient_id: {
        type: String,
        required: true,
    },
    doctors: [{
        doctor_id: {
            type: String,
            required: true,
        }

    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Favourate', favourateSchema);
