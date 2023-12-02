const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    product_id:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product' // Reference to the 'Pharmacy' model
    }],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Reference to the 'Pharmacy' model
    },
    quantity: {
        type: String,
        default: null,
    },
    SKU: {
        type: String,
        default: null,
    },
    total: {
        type: String,
        default: null,
    }
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Cart', cartSchema);