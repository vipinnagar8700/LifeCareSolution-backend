const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var purchaseSchema = new mongoose.Schema({
    Medicine_Name:{
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
        default:null,
    }
    ,Quantity:{
        type:String,
        default:null,
    },
    Expire_Date:{
        type:String,
        default:null,
    },
    image:{
        type:String,
        default:null,
    }
    , pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy' // Reference to the 'Pharmacy' model
    }
   
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Purchase', purchaseSchema);