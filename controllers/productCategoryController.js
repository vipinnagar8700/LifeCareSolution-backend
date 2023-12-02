const { generateToken } = require('../config/JwtToken');
const ProductCategory = require('../models/pharmacyCategoryModels');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddProductCategorys = asyncHandler(async (req, res) => {
    try {
        const { name, pharmacy_id } = req.body;

        // ProductCategory does not exist, so create a new ProductCategory
        const newProductCategory = await ProductCategory.create({ name, pharmacy_id });

        res.status(201).json({
            message: "ProductCategory Successfully Created!",
            success: true,
            // data: newProductCategory
        });
    } catch (error) {
        res.status(409).json({
            message: "ProductCategory creation failed",
            success: false,
            error: error.message  // You might want to provide more details about the error
        });
    }
});





const AllProductCategorys = async (req, res) => {
    try {
        const patients = await ProductCategory.find(); // Exclude the 'password' field;
        const length = patients.length;
        res.status(200).json([{
            message: "All ProductCategorys data retrieved successfully!",
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

// Get all Product Categories associated with a specific Pharmacy
const pharmacyProductCategory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const productCategories = await ProductCategory.find({ pharmacy_id: id });
        console.log(productCategories)
        const length = productCategories.length;
        res.status(200).json({
            message: "ProductCategories retrieved successfully!",
            success: true,
            data: productCategories,
            length
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            success: false
        });
    }
};


const editProductCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const editProductCategory = await ProductCategory.findById(id); // Exclude the 'password' field
        if (!editProductCategory) {
            res.status(200).json({
                message: "ProductCategory was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully Retrieved!",
                success: true,
                data: editProductCategory
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            status: false
        });
    }
}
const UpdateProductCategorys = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editProductCategory = await ProductCategory.findByIdAndUpdate(id, updateData, { new: true });

        if (!editProductCategory) {
            res.status(200).json({
                message: "ProductCategory was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editProductCategory
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}


const deleteProductCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const editProductCategory = await ProductCategory.findByIdAndDelete(id); // Exclude the 'password' field
        if (!editProductCategory) {
            res.status(200).json({
                message: "ProductCategory was not found!",
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
    AddProductCategorys,
    AllProductCategorys, editProductCategory, UpdateProductCategorys, deleteProductCategory, pharmacyProductCategory
}