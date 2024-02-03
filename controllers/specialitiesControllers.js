const { generateToken } = require('../config/JwtToken');
const Specialities = require('../models/specialitiesModel');
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

const AddSpecialitiess = asyncHandler(async (req, res) => {
    const { specialities_name } = req.body;

    const file = req.file;

    let imageUrl; // to store the Cloudinary image URL

    if (file) {
        try {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: 'Specialities',
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

    const existingSpecialities = await Specialities.findOne({
        specialities_name: specialities_name
    });

    if (!existingSpecialities) {
        const newSpecialities = await Specialities.create({
            specialities_name: specialities_name,
            image: imageUrl, // add the Cloudinary image URL to the newSpecialities object
        });

        return res.status(201).json({
            message: "Specialities Successfully Created!",
            success: true,
            data: newSpecialities
        });
    } else {
        const message = existingSpecialities.specialities_name === specialities_name
            ? "Speciality name already exists."
            : "Speciality with the same name already exists.";

        return res.status(409).json({
            message,
            success: false
        });
    }
});





const AllSpecialitiess = async (req, res) => {
    try {
        const patients = await Specialities.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Specialitiess data retrieved successfully!",
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

const editSpecialities = async (req, res) => {
    const { id } = req.params;
    try {
        const editSpecialities = await Specialities.findById(id); // Exclude the 'password' field
        if (!editSpecialities) {
            res.status(200).json({
                message: "Specialities was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrived!",
                success: true,
                data:editSpecialities
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Retrived Data!",
            status: false
        });
    }
}

const updateSpecialities = async (req, res) => {
    const { id } = req.params;
    try {
        const editSpecialities = await Specialities.findByIdAndUpdate(id); // Exclude the 'password' field
        if (!editSpecialities) {
            res.status(200).json({
                message: "Specialities was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Updated!",
                success: true,
                
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to Updated Data!",
            status: false
        });
    }
}

const deleteSpecialities = async (req, res) => {
    const { id } = req.params;
    try {
        const editSpecialities = await Specialities.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editSpecialities) {
            res.status(200).json({
                message: "Specialities was not found!",
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
    AddSpecialitiess,
     AllSpecialitiess,deleteSpecialities,updateSpecialities,editSpecialities
}