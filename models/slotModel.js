const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const slotSchema = new mongoose.Schema({
    time_duration: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    start_time: {
        type: String,
        required: true,
    },
    end_time: {
        type: String,
        required: true,
    },
    doctor_id: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Slot', slotSchema);