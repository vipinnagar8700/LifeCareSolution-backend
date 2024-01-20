
const { generateToken } = require("../config/JwtToken");
const {
  User,
  Doctor,
  Patient,
  Pharmacy,
} = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const multer = require("multer");
const path = require("path");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const edit_admin_profile = async (req, res) => {
    const { id } = req.params;
    try {
      const editUser = await User.findById( id ); // Exclude the 'password' field
      if (!editUser) {
        res.status(200).json({
          message: "Admin was not found!",
          status:false
        });
      } else {
        res.status(201).json({
          message: "Data successfully Retrieved!",
          success: true,
          data: editUser,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Failed to retrieve Data!",
        status: false,
      });
    }
  };
  // Multer configuration
  
  const Update_admin_profile = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body
    const file = req.file;
  
  if (file) {
      try {
          const result = await cloudinary.uploader.upload(file.path, {
              folder: 'LifeCareSolution_admin', // Optional: You can specify a folder in your Cloudinary account
              resource_type: 'auto', // Automatically detect the file type
          });
  
          updateData.image = result.secure_url;
      } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          // Handle the error appropriately
      }
  }
  
  const domain = 'https://viplifecaresolution.onrender.com';
  
  // Replace backslashes with forward slashes and remove leading './'
  const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');
  
  // Construct the full image URL
  const imageUrl = `${domain}/${relativePath}`;
  
  console.log(imageUrl);
  
    delete updateData.role;
  
    try {
      const editUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
  
      if (!editUser) {
        res.status(200).json({
          message: "admin was not found!",
        });
      } else {
        res.status(201).json({
          message: "Data successfully updated!",
          success: true,
          data: editUser,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "Failed to update data!",
        status: false,
      });
    }
  };




  module.exports = {
    Update_admin_profile,edit_admin_profile
  };
  