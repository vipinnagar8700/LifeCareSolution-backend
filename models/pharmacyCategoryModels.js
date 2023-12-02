const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productCategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    pharmacy_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pharmacy' // Reference to the 'Pharmacy' model
    }
   
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('ProductCategory', productCategorySchema);