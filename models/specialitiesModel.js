const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var specialitiesSchema = new mongoose.Schema({
    specialities_name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default:null
    },

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Specialities', specialitiesSchema);