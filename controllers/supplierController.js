const { generateToken } = require('../config/JwtToken');
const Supplier = require('../models/supplierModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddSupplier = asyncHandler(async (req, res) => {
    try {
        const { name ,email,mobile,company,address,pharmacy_id} = req.body;

        // Supplier does not exist, so create a new Supplier
        const newSupplier = await Supplier.create(req.body);

        res.status(201).json({
            message: "Supplier Successfully Created!",
            success: true,
            // data: newSupplier
        });
    } catch (error) {
        res.status(409).json({
            message: "Supplier creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});


const AllSupplier = async (req, res) => {
    try {
        const patients = await Supplier.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Supplier data retrieved successfully!",
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
const AllPharmacySupplier = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const patients = await Supplier.find({pharmacy_id:id}); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Supplier data retrieved successfully!",
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

const editSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const editSupplier = await Supplier.findById(id); // Exclude the 'password' field
        if (!editSupplier) {
            res.status(200).json({
                message: "Supplier was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editSupplier
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}

const UpdateSupplier = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editSupplier = await Supplier.findByIdAndUpdate(id, updateData, { new: true });

        if (!editSupplier) {
            res.status(200).json({
                message: "Supplier was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editSupplier
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}


const deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const editSupplier = await Supplier.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editSupplier) {
            res.status(200).json({
                message: "Supplier was not found!",
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
    AddSupplier,
    AllSupplier, editSupplier, UpdateSupplier, deleteSupplier,AllPharmacySupplier
}