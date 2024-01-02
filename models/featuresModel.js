const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var featuresSchema = new mongoose.Schema({
    
    features_name: {
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
module.exports = mongoose.model('Features', featuresSchema);