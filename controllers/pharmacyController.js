const { generateToken } = require('../config/JwtToken');
const { Pharmacy} = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')



const AllPharmacys = async (req, res) => {
    try {
        const pharmacies = await Pharmacy.find().select('-password').sort({ createdAt: -1 }); // Use 'pharmacies' instead of 'Pharmacy'
        const length = pharmacies.length;
        res.status(200).json([{
            message: "All Pharmacy data retrieved successfully!",
            data: pharmacies,
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

const editPharmacy = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const pharmacy = await Pharmacy.findById(id).select('-password'); // Use 'pharmacy' instead of 'Pharmacy'
        console.log(pharmacy)// Exclude the 'password' field
        if (!pharmacy) {
            res.status(404).json({
                message: "Pharmacy was not found!",
                success: false,
            });
        } else {
            res.status(200).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: pharmacy
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,
        });
    }
}


const UpdatePharmacy = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData
    delete updateData.role;

    try {
        const editPharmacy = await Pharmacy.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!editPharmacy) {
            res.status(200).json({
                message: "Pharmacy was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editPharmacy
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

const deletePharmacy = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the Pharmacy by ID
        const Pharmacy = await Pharmacy.findById(id);

        if (!Pharmacy) {
            return res.status(200).json({
                message: "Pharmacy was not found!",
            });
        }

        if (Pharmacy.role === "admin") {
            return res.status(403).json({
                message: "Admin Pharmacy cannot be deleted.",
                status: false,
            });
        }

        // If the Pharmacy is not an admin, proceed with the deletion
        const deletedPharmacy = await Pharmacy.findByIdAndDelete(id);

        if (!deletedPharmacy) {
            return res.status(200).json({
                message: "Pharmacy was not found!",
            });
        } else {
            return res.status(201).json({
                message: "Data successfully deleted!",
                success: true,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete data!",
            status: false,
        });
    }
}

module.exports = {
     AllPharmacys, editPharmacy, UpdatePharmacy, deletePharmacy
}