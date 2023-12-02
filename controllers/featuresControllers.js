const { generateToken } = require('../config/JwtToken');
const Features = require('../models/featuresModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const Addfeaturess = asyncHandler(async (req, res) => {
    const { features_name } = req.body;

    // Check if a features with the given email or phone already exists
    const existingfeatures = await Features.findOne({
        $or: [
            { features_name }
        ]
    });

    if (!existingfeatures) {
        // features does not exist, so create a new features
        const newfeatures = await features.create(req.body);
        res.status(201).json({
            message: "features Successfully Created!",
            success: true,
            data:newfeatures
        });
    } else {
        // features with the same email or phone already exists
        const message = existingfeatures.features_name === features_name
            ? "features_name is already exists."
            : "features_name is already exists.";
        res.status(409).json({
            message,
            success: false
        });
    }
});

const Allfeaturess = async (req, res) => {
    try {
        const patients = await Features.find(); // Exclude the 'password' field;
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

module.exports = {
    Addfeaturess,
     Allfeaturess,deletefeatures
}