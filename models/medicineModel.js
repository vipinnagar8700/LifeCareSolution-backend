const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const medicineSchema = new mongoose.Schema({
    patient_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    title_name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    hospital_name: {
        type: String,
        required: true,
    },
    patient_name: {
        type: String,
        required: true,
    },
    Symptoms: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Medicine', medicineSchema);