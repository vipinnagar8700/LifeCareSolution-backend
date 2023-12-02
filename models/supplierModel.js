const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var supplierSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    company:{
        type:String,
        default:null,
    },
    address:{
        type:String,
        default:null,
    },
    image:{
        type:String,
        default:null,
    },
    pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy' // Reference to the 'Pharmacy' model
    }
});

//Export the model
module.exports = mongoose.model('Supplier', supplierSchema);