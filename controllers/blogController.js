const { generateToken } = require('../config/JwtToken');
const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')
const multer = require('multer')
const BlogCategory = require('../models/blogCategoryModel')

// Multer configuration
const storage = multer.diskStorage({
    destination: './public/images', // Specify the destination folder
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit (optional)
});



const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});


const AddBlogs = asyncHandler(async (req, res) => {
    const { title, content, category_id,specailitie_id,written_by } = req.body;
console.log(title, content, category_id,specailitie_id,written_by )
    let imageUrl; // to store the Cloudinary image URL

    const file = req.file;

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'Blogs', // Specify your Cloudinary folder
                resource_type: 'auto',
            });
            imageUrl = result.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            return res.status(500).json({
                message: 'Internal Server Error',
                success: false,
            });
        }
    }

    const existingBlog = await Blog.findOne({ title: title });

    if (!existingBlog) {
        const newBlog = await Blog.create({
            title: title,
            content: content,
            written_by: written_by,category_id: category_id,specailitie_id: specailitie_id,
            image: imageUrl, // add the Cloudinary image URL to the newBlog object
        });

        res.status(201).json({
            message: "Blog Successfully Created!",
            success: true,
            data: newBlog
        });
    } else {
        const message = existingBlog.title === title
            ? "Title is already exists."
            : "Blog with the same title already exists.";

        res.status(409).json({
            message,
            success: false
        });
    }
});





const AllBlogs = async (req, res) => {
    try {
        const patients = await Blog.find().populate('category_id').populate('specailitie_id'); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Blogs data retrieved successfully!",
            data: patients,
            status: true,
            length
        }]);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};


const editBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const editBlog = await Blog.findById(id).populate('category_id').populate('specailitie_id'); // Exclude the 'password' field
        if (!editBlog) {
            res.status(200).json({
                message: "Blog was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editBlog
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}
const UpdateBlogs = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!editBlog) {
            res.status(200).json({
                message: "Blog was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editBlog
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

const AddBlogsCategory = asyncHandler(async (req, res) => {
    const { title,written_by } = req.body;

    // Check if a Blog with the given email or phone already exists
    const existingBlog = await BlogCategory.findOne({
        $or: [
            { title }
        ]
    });

    if (!existingBlog) {
        // Blog does not exist, so create a new Blog
        const newBlog = await BlogCategory.create(req.body);
        res.status(201).json({
            message: "Blog Category Successfully Created!",
            success: true,
            data:newBlog
        });
    } else {
        // Blog with the same email or phone already exists
        const message = existingBlog.title === title
            ? "title is already exists."
            : "title is already exists.";
        res.status(409).json({
            message,
            success: false
        });
    }
});
const AllCategory = async (req, res) => {
    try {
        const patients = await BlogCategory.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Blogs Category data retrieved successfully!",
            data: patients,
            status: true,
            length
        }]);
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};

const deleteBlogCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const editBlog = await BlogCategory.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editBlog) {
            res.status(200).json({
                message: "Blog was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Deleted!",
                success: true,
                
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Deleted Data!",
            status: false
        });
    }
}


const deleteBlog = async (req, res) => {
    const { id } = req.params;
    try {
        const editBlog = await Blog.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editBlog) {
            res.status(200).json({
                message: "Blog was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Deleted!",
                success: true,
                
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Deleted Data!",
            status: false
        });
    }
}

module.exports = {
    AddBlogs,
     AllBlogs,editBlog,UpdateBlogs,AddBlogsCategory,AllCategory,deleteBlogCategory,deleteBlog
}