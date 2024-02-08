const { generateToken } = require('../config/JwtToken');
const Medicine = require('../models/medicineModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddMedicines = asyncHandler(async (req, res) => {
    try {
        const { patient_id, title_name, image, hospital_name, patient_name, Symptoms, dob } = req.body;

        // Medicine does not exist, so create a new Medicine
        const newMedicine = await Medicine.create(req.body);

        res.status(201).json({
            message: "Medicine Successfully Created!",
            success: true,
            data: newMedicine
        });
    } catch (error) {
        res.status(409).json({
            message: "Medicine creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});





const AllMedicines = async (req, res) => {
    try {
        const patients = await Medicine.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Medicines data retrieved successfully!",
            data: patients,
            status: true,
            length
        }]).sort({ createdAt: -1 });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: false
        });
    }
};


const editMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const editMedicine = await Medicine.findById(id); // Exclude the 'password' field
        if (!editMedicine) {
            res.status(200).json({
                message: "Medicine was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editMedicine
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}
const UpdateMedicines = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editMedicine = await Medicine.findByIdAndUpdate(id, updateData, { new: true });

        if (!editMedicine) {
            res.status(200).json({
                message: "Medicine was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editMedicine
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}


const deleteMedicine = async (req, res) => {
    const { id } = req.params;
    try {
        const editMedicine = await Medicine.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editMedicine) {
            res.status(200).json({
                message: "Medicine was not found!",
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
    AddMedicines,
    AllMedicines, editMedicine, UpdateMedicines, deleteMedicine
}