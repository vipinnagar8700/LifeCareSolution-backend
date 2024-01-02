const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
    cart_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    products: [
        {
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product' // Reference to the 'Product' model
            },
            quantity: Number
        }
    ],
    First_Name: {
        type: String,
        required: true,
    },
    Last_Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,

    },
    delivery_address: {
        type: String,
        required: true,
    },
    NameOnCard: {
        type: String,
        default: null,
    },
    CardNumber: {
        type: String,
        default: null,
    },
    ExpiryMonth: {
        type: String,
        default: null,
    },
    
    ExpiryYear: {
        type: String,
        default: null,
    },
    CVV: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'cancelled', 'completed', 'processing', 'shipped', 'delivered', 'returned'],
    },

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Order', orderSchema);