const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    category_id:  { type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" },
    specailitie_id:  { type: mongoose.Schema.Types.ObjectId, ref: "Specialities" },
    image: {
        type: String,
        default:null,
    },
    written_by: {
        type: String,
        required: true,
    },
    comments: {
        type: String,
        default:null,
    },
    likes: {
        type: String,
        default:null,
    },
    Dislikes: {
        type: String,
        default:null,
    },
},{
    timestamps:true
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);