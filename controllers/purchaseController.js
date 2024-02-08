const { generateToken } = require('../config/JwtToken');
const Purchase = require('../models/purchaseModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')


const AddPurchases = asyncHandler(async (req, res) => {
    try {
        const { Medicine_Name, category, Price, Quantity, Expire_Date, image,pharmacy_id } = req.body;

        // Purchase does not exist, so create a new Purchase
        const newPurchase = await Purchase.create(req.body);

        res.status(201).json({
            message: "Purchase Successfully Created!",
            success: true,
            // data: newPurchase
        });
    } catch (error) {
        res.status(409).json({
            message: "Purchase creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});

const AllPurchases = async (req, res) => {
    try {
        const patients = await Purchase.find().sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Purchases data retrieved successfully!",
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


const AllPharmacyPurchases = async (req, res) => {
    try {
        const {id}= req.params;
        const patients = await Purchase.find({
            pharmacy_id:id
        }).sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Purchases data retrieved successfully!",
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
const editPurchase = async (req, res) => {
    const { id } = req.params;
    try {
        const editPurchase = await Purchase.findById(id); // Exclude the 'password' field
        if (!editPurchase) {
            res.status(200).json({
                message: "Purchase was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editPurchase
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}
const UpdatePurchases = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editPurchase = await Purchase.findByIdAndUpdate(id, updateData, { new: true });

        if (!editPurchase) {
            res.status(200).json({
                message: "Purchase was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editPurchase
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}


const deletePurchase = async (req, res) => {
    const { id } = req.params;
    try {
        const editPurchase = await Purchase.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editPurchase) {
            res.status(200).json({
                message: "Purchase was not found!",
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
    AddPurchases,
    AllPurchases, editPurchase, UpdatePurchases, deletePurchase,AllPharmacyPurchases
}