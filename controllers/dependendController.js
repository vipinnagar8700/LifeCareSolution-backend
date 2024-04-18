const Dependent = require('../models/dependentModel');
const asyncHandler = require('express-async-handler');
require('dotenv/config')

const cloudinary = require('cloudinary').v2;  // Make sure to install the 'cloudinary' package

// Configure Cloudinary with your account credentials
cloudinary.config({
    cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});




const AddDependents = asyncHandler(async (req, res) => {
    try {
      const { patient_id, Dependent_name, relationShip, gender, blood_group, dob } = req.body;
  
      // Upload image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, { folder: 'dependents' });
      // Add the Cloudinary URL to the req.body before creating the dependent
      req.body.image = cloudinaryResponse.secure_url;
  
      // Dependent does not exist, so create a new Dependent
      const newDependent = await Dependent.create(req.body);
  
      res.status(201).json({
        message: "Dependent Successfully Created!",
        success: true,
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
        const patients = await Dependent.find().populate('patient_id').sort({ createdAt: -1 });// Exclude the 'password' field;
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


const AllPatientDependents = async (req, res) => {
  const { patient_id } = req.params;
  try {
      const patients = await Dependent.find({ patient_id }).populate('patient_id').sort({ createdAt: -1 });// Exclude the 'password' field;
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
        const editDependent = await Dependent.findById(id).populate('patient_id'); // Exclude the 'password' field
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
        // Check if an image is provided in the updateData
        if (updateData.image) {
          // Upload the new image to Cloudinary
          const cloudinaryResponse = await cloudinary.uploader.upload(updateData.image, { folder: 'dependents' });
    
          // Update the updateData with the new Cloudinary URL
          updateData.image = cloudinaryResponse.secure_url;
        }
    
        const editDependent = await Dependent.findByIdAndUpdate(id, updateData, { new: true });
    
        if (!editDependent) {
          res.status(404).json({
            message: "Dependent not found!",
            success: false,
          });
        } else {
          res.status(200).json({
            message: "Data successfully updated!",
            success: true,
            data: editDependent
          });
        }
      } catch (error) {
        res.status(500).json({
          message: "Failed to update data!",
          success: false,
          error: error.message
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
    AllDependents, editDependent, UpdateDependents, deleteDependent,AllPatientDependents
}