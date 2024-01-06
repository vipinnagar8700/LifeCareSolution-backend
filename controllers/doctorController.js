const { generateToken } = require("../config/JwtToken");
const { Doctor } = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const AllDoctors = async (req, res) => {
  try {
    const doctores = await Doctor.find().select("-password"); // Exclude the 'password' field;
    const length = doctores.length;
    res.status(200).json([
      {
        message: "All doctor data retrieved successfully!",
        data: doctores,
        status: true,
        length,
      },
    ]);
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const editDoctor = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const doctor = await Doctor.findOne({ user_id: id });
    console.log(doctor); // Exclude the 'password' field
    if (!doctor) {
      res.status(404).json({
        // Correct the status code to 404 (Not Found)
        message: "Doctor was not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        // Correct the status code to 200 (OK)
        message: "Data successfully Retrieved!",
        success: true,
        data: doctor,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      success: false, // Correct the key to 'success'
    });
  }
};

const UpdateDoctor = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const imageFile = req.files["image"]; // Use req.files to get multiple files
  const clinicImageFile = req.files["ClinicImage"];

  if (imageFile) {
    try {
      const result = await cloudinary.uploader.upload(imageFile[0].path, {
        folder: "LifeCareSolution", // Optional: You can specify a folder in your Cloudinary account
        resource_type: "auto", // Automatically detect the file type
      });

      updateData.image = result.secure_url;
      console.log("Updated Image:", updateData.image);

      // Optional: Delete the local file after successfully uploading to Cloudinary
      // fs.unlinkSync(imageFile[0].path);
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      // Handle the error appropriately
    }
  } else {
    console.log("No image file found in req.files");
  }

  if (clinicImageFile) {
    try {
      const clinicImages = await Promise.all(
        clinicImageFile.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "LifeCareSolution",
            resource_type: "auto",
          });
          return { image: result.secure_url };
        })
      );

      updateData.ClinicImage = clinicImages;
    } catch (error) {
      console.error("Error uploading clinic images to Cloudinary:", error);
      // Handle the error appropriately
    }
  }

  if (updateData.Services) {
    updateData.Services = updateData.Services.split(",").map((service) =>
      service.trim()
    );
  }
  if (updateData.Specailization) {
    updateData.Specailization = updateData.Specailization.split(",").map(
      (service) => service.trim()
    );
  }
  if (updateData.Education) {
    updateData.Education = JSON.parse(updateData.Education);
  }
  if (updateData.Experience) {
    updateData.Experience = JSON.parse(updateData.Experience);
  }

  if (updateData.Awards) {
    updateData.Awards = JSON.parse(updateData.Awards);
  }

  delete updateData.role;

  try {
    const finding = await Doctor.findOne({ user_id: id });
    const editDoctor = await Doctor.findByIdAndUpdate(finding._id, updateData, {
      new: true,
    }).select("-password");

    if (!editDoctor) {
      res.status(200).json({
        message: "Doctor was not found!",
        status: false,
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};

const UpdateDoctorSocail_Media = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body

  // Create an object with only the social media fields you want to update
  const socialMediaUpdates = {
    fb_Url: updateData.fb_Url || null,
    Twitter_Url: updateData.Twitter_Url || null,
    Instagram_Url: updateData.Instagram_Url || null,
    Pinterest_url: updateData.Pinterest_url || null,
    Linked_In_Url: updateData.Linked_In_Url || null,
    YouTube_Url: updateData.YouTube_Url || null,
  };

  // Make sure to exclude the 'role' field from the updateData

  try {
    const editDoctor = await Doctor.findByIdAndUpdate(id, socialMediaUpdates, {
      new: true,
    });

    if (!editDoctor) {
      res.status(200).json({
        message: "Doctor was not found!",
      });
    } else {
      res.status(201).json({
        message: "Social media data successfully updated!",
        success: true,
        data: editDoctor,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update social media data!",
      status: false,
    });
  }
};

const UpdateDoctorBankDetails = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body

  // Create an object with only the social media fields you want to update
  const socialMediaUpdates = {
    BankName: updateData.BankName || null,
    BranchName: updateData.BranchName || null,
    Account_Number: updateData.Account_Number || null,
    AccountName: updateData.AccountName || null,
  };

  // Make sure to exclude the 'role' field from the updateData

  try {
    const editDoctor = await Doctor.findByIdAndUpdate(id, socialMediaUpdates, {
      new: true,
    });

    if (!editDoctor) {
      res.status(200).json({
        message: "Doctor was not found!",
      });
    } else {
      res.status(201).json({
        message: "Bank Account  data successfully updated!",
        success: true,
        data: editDoctor,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update Bank Account  data !",
      status: false,
    });
  }
};

const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the Doctor by ID
    const Doctor = await Doctor.findById(id);

    if (!Doctor) {
      return res.status(200).json({
        message: "Doctor was not found!",
      });
    }

    if (Doctor.role === "admin") {
      return res.status(403).json({
        message: "Admin Doctor cannot be deleted.",
        status: false,
      });
    }

    // If the Doctor is not an admin, proceed with the deletion
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    if (!deletedDoctor) {
      return res.status(200).json({
        message: "Doctor was not found!",
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
};

const deleteDoctorAwards = async (req, res) => {
  const { doctorId, awardId } = req.params;

  try {
    // Find the Doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found!",
        success: false,
      });
    }

    // Find the Award by ID
    const awardIndex = doctor.Awards.findIndex((award) => award._id == awardId);

    if (awardIndex === -1) {
      return res.status(404).json({
        message: "Award not found!",
        success: false,
      });
    }

    // Remove the Award from the array
    doctor.Awards.splice(awardIndex, 1);

    // Save the updated Doctor document
    await doctor.save();

    return res.status(200).json({
      message: "Award successfully deleted!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete award!",
      success: false,
      error: error.message,
    });
  }
};

const deleteDoctorEducation = async (req, res) => {
  const { doctorId, EducationId } = req.params;

  try {
    // Find the Doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found!",
        success: false,
      });
    }

    // Find the Award by ID
    const awardIndex = doctor.Education.findIndex(
      (award) => award._id == EducationId
    );

    if (awardIndex === -1) {
      return res.status(404).json({
        message: "Education not found!",
        success: false,
      });
    }

    // Remove the Award from the array
    doctor.Education.splice(awardIndex, 1);

    // Save the updated Doctor document
    await doctor.save();

    return res.status(200).json({
      message: "Education successfully deleted!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete Education!",
      success: false,
      error: error.message,
    });
  }
};

const deleteDoctorExperience = async (req, res) => {
  const { doctorId, ExperienceId } = req.params;

  try {
    // Find the Doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found!",
        success: false,
      });
    }

    // Find the Award by ID
    const awardIndex = doctor.Experience.findIndex(
      (award) => award._id == ExperienceId
    );

    if (awardIndex === -1) {
      return res.status(404).json({
        message: "Experience not found!",
        success: false,
      });
    }

    // Remove the Award from the array
    doctor.Experience.splice(awardIndex, 1);

    // Save the updated Doctor document
    await doctor.save();

    return res.status(200).json({
      message: "Experience successfully deleted!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete Experience!",
      success: false,
      error: error.message,
    });
  }
};
const deleteClinicImage = async (req, res) => {
  const { doctorId, ClinicImageId } = req.params;

  try {
    // Find the Doctor by ID
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found!",
        success: false,
      });
    }

    // Find the Award by ID
    const awardIndex = doctor.ClinicImage.findIndex(
      (award) => award._id == ClinicImageId
    );

    if (awardIndex === -1) {
      return res.status(404).json({
        message: "ClinicImage not found!",
        success: false,
      });
    }

    // Remove the Award from the array
    doctor.ClinicImage.splice(awardIndex, 1);

    // Save the updated Doctor document
    await doctor.save();

    return res.status(200).json({
      message: "ClinicImage successfully deleted!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete ClinicImage!",
      success: false,
      error: error.message,
    });
  }
};


module.exports = {
  AllDoctors,
  editDoctor,
  UpdateDoctor,
  deleteDoctor,
  UpdateDoctorSocail_Media,
  UpdateDoctorBankDetails,
  deleteDoctorAwards,
  deleteDoctorEducation,
  deleteDoctorExperience,
  deleteClinicImage,
};
