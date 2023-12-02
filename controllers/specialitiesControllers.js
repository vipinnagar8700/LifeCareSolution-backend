const { generateToken } = require('../config/JwtToken');
const Specialities = require('../models/specialitiesModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const AddSpecialitiess = asyncHandler(async (req, res) => {
    const { specialities_name } = req.body;

    // Check if a Specialities with the given email or phone already exists
    const existingSpecialities = await Specialities.findOne({
        $or: [
            { specialities_name }
        ]
    });

    if (!existingSpecialities) {
        // Specialities does not exist, so create a new Specialities
        const newSpecialities = await Specialities.create(req.body);
        res.status(201).json({
            message: "Specialities Successfully Created!",
            success: true,
            data:newSpecialities
        });
    } else {
        // Specialities with the same email or phone already exists
        const message = existingSpecialities.specialities_name === specialities_name
            ? "specialities_name is already exists."
            : "specialities_name is already exists.";
        res.status(409).json({
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
     AllSpecialitiess,deleteSpecialities
}