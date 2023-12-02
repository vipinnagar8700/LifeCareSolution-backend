const { generateToken } = require('../config/JwtToken');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddProducts = asyncHandler(async (req, res) => {
    try {
        const { Product_Name, Category, Price, Quantity, Discount, Descriptions, image, pharmacy_id } = req.body;

        // Product does not exist, so create a new Product
        const newProduct = await Product.create(req.body);

        res.status(201).json({
            message: "Product Successfully Created!",
            success: true,
            // data: newProduct
        });
    } catch (error) {
        res.status(409).json({
            message: "Product creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});


const AllPharmacyProducts = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const patients = await Product.find({ pharmacy_id: id }); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Products data retrieved successfully!",
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


const AllProducts = async (req, res) => {
    try {
        const patients = await Product.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All Products data retrieved successfully!",
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


const editProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const editProduct = await Product.findById(id); // Exclude the 'password' field
        if (!editProduct) {
            res.status(200).json({
                message: "Product was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editProduct
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}

const UpdateProducts = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!editProduct) {
            res.status(200).json({
                message: "Product was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editProduct
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const editProduct = await Product.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editProduct) {
            res.status(200).json({
                message: "Product was not found!",
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
    AddProducts,
    AllProducts, editProduct, UpdateProducts, deleteProduct,AllPharmacyProducts,
}