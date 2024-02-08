const { generateToken } = require('../config/JwtToken');
const Features = require('../models/featuresModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});


const Addfeaturess = asyncHandler(async (req, res) => {
    const { features_name } = req.body;

    const file = req.file;

    let imageUrl; // to store the Cloudinary image URL

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'Features', // Specify your Cloudinary folder
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

    const existingfeatures = await Features.findOne({
        features_name: features_name
    });

    if (!existingfeatures) {
        const newfeatures = await Features.create({
            features_name: features_name,
            image: imageUrl,
        });
        

        return res.status(201).json({
            message: "Features Successfully Created!",
            success: true,
            data: newfeatures
        });
    } else {
        const message = existingfeatures.features_name === features_name
            ? "Feature name already exists."
            : "Feature with the same name already exists.";

        return res.status(409).json({
            message,
            success: false
        });
    }
});


const Allfeaturess = async (req, res) => {
    try {
        const patients = await Features.find().sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All featuress data retrieved successfully!",
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


const deletefeatures = async (req, res) => {
    const { id } = req.params;
    try {
        const editfeatures = await Features.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editfeatures) {
            res.status(200).json({
                message: "features was not found!",
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


const editFeatures = async (req, res) => {
    const { id } = req.params;
    try {
        const editFeatures = await Features.findById(id); // Exclude the 'password' field
        if (!editFeatures) {
            res.status(200).json({
                message: "Features was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrived!",
                success: true,
                data:editFeatures
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Retrived Data!",
            status: false
        });
    }
}

const updateFeatures = asyncHandler(async (req, res) => {
    const { id } = req.params; // Assuming you are passing the speciality ID in the URL parameters
    const { features_name } = req.body;

    const file = req.file;

    let imageUrl; // to store the Cloudinary image URL

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'Features',
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

    try {
        const existingFeatures = await Features.findById(id);

        if (!existingFeatures) {
            return res.status(404).json({
                message: 'Features not found',
                success: false,
            });
        }

        // Update the speciality with the new data
        existingFeatures.features_name = features_name;
        if (imageUrl) {
            existingFeatures.image = imageUrl; // Update the image URL if a new image is provided
        }
        await existingFeatures.save();

        return res.status(200).json({
            message: 'Features successfully updated',
            success: true,
            data: existingFeatures,
        });
    } catch (error) {
        console.error('Error updating Features:', error);
        return res.status(500).json({
            message: 'Failed to update Features',
            success: false,
            error: error.message,
        });
    }
});




module.exports = {
    Addfeaturess,
     Allfeaturess,deletefeatures,editFeatures,updateFeatures
}