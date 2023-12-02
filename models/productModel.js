const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    Product_Name:{
        type:String,
        required:true,
        unique:true,
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory' // Reference to the 'Pharmacy' model
    },
    Price:{
        type:String,
        required:true,
    },
    Quantity:{
        type:String,
        required:true,
    },
    Discount:{
        type:String,
        required:true,
    },
    Descriptions :{
        type:String,
        required:true,
    },
    image :{
        type:String,
        default:null,
    },
    pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy' // Reference to the 'Pharmacy' model
    }
    
}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Product', productSchema);