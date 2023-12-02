const { generateToken } = require('../config/JwtToken');
const Dependent = require('../models/dependentModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddDependents = asyncHandler(async (req, res) => {
    try {
        const { patient_id, Dependent_name, image, relationShip, gender, blood_group, dob } = req.body;

        // Dependent does not exist, so create a new Dependent
        const newDependent = await Dependent.create(req.body);

        res.status(201).json({
            message: "Dependent Successfully Created!",
            success: true,
            data: newDependent
        });
    } catch (error) {
        res.status(409).json({
            message: "Dependent creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});





const AllDependents = async (req, res) => {
    try {
        const patients = await Dependent.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Dependents data retrieved successfully!",
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


const editDependent = async (req, res) => {
    const { id } = req.params;
    try {
        const editDependent = await Dependent.findById(id); // Exclude the 'password' field
        if (!editDependent) {
            res.status(200).json({
                message: "Dependent was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editDependent
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}
const UpdateDependents = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editDependent = await Dependent.findByIdAndUpdate(id, updateData, { new: true });

        if (!editDependent) {
            res.status(200).json({
                message: "Dependent was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editDependent
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}


const deleteDependent = async (req, res) => {
    const { id } = req.params;
    try {
        const editDependent = await Dependent.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editDependent) {
            res.status(200).json({
                message: "Dependent was not found!",
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
    AddDependents,
    AllDependents, editDependent, UpdateDependents, deleteDependent
}