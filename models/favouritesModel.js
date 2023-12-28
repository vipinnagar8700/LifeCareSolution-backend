const mongoose = require('mongoose');

const favourateSchema = new mongoose.Schema({
    patient_id: 
        { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    
        doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Favourate', favourateSchema);
