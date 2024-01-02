const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const dependentSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
    Dependent_name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    relationShip: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    blood_group: {
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
module.exports = mongoose.model('Dependent', dependentSchema);