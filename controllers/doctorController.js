const { Doctor, User } = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Activity = require("../models/activityModel");
require("dotenv/config");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const AllDoctors = async (req, res) => {
  try {
    const doctores = await Doctor.find()
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 }); // Exclude the 'password' field;
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

const AllDoctorPermitted = async (req, res) => {
  try {
    const doctors = await Doctor.find({ permission: true, status: "approved" })
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 }); // Exclude the 'password' field and populate 'Specailization'

    const length = doctors.length;

    res.status(200).json({
      message: "All doctor data retrieved successfully!",
      data: doctors,
      status: true,
      length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const AllDoctorPending = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "pending" })
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 }); // Exclude the 'password' field and populate 'Specailization'

    const length = doctors.length;

    res.status(200).json({
      message: "All doctor data retrieved successfully!",
      data: doctors,
      status: true,
      length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const AllDoctorApproved = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "approved" })
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 }); // Exclude the 'password' field and populate 'Specailization'

    const length = doctors.length;

    res.status(200).json({
      message: "All doctor data retrieved successfully!",
      data: doctors,
      status: true,
      length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const AllDoctorBlocked = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "blocked" })
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 }); // Exclude the 'password' field and populate 'Specailization'

    const length = doctors.length;

    res.status(200).json({
      message: "All doctor data retrieved successfully!",
      data: doctors,
      status: true,
      length,
    });
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
    const doctor = await Doctor.findOne({ user_id: id }).populate(
      "Specailization"
    );
    if (!doctor) {
      res.status(404).json({
        // Correct the status code to 404 (Not Found)
        message: "Doctor was not found!",
        success: false,
      });
    } else {
      const activity = new Activity({
        doctor_id: doctor._id, // Use doctor's ID
        type: "Doctor edit there profile",
        details: "Doctor edit their profile information",
      });
      await activity.save(); // Save activity to the database

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
    // Check if the email is being updated
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email });

      if (existingUser && existingUser._id.toString() !== id) {
        return res.status(400).json({
          message: "Email already exists",
          success: false,
        });
      }
    }

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
      // If email is updated, update User table as well
      if (updateData.email && updateData.email !== editDoctor.email) {
        try {
            // Find the user in the User table and update their email
            const updateUser = await User.findOneAndUpdate(
                { _id: editDoctor.user_id }, // Filter by user ID
                { email: updateData.email }, // Update email field
                { new: true } // Return the updated document
            );
    
            if (!updateUser) {
                return res.status(500).json({
                    message: "Failed to update email in User table",
                    success: false,
                });
            }
    
            console.log(updateUser, "updateUser");
    
        } catch (error) {
            console.error("Error updating email in User table:", error);
            return res.status(500).json({
                message: "Failed to update email in User table",
                success: false,
                error: error.message
            });
        }
    }
    

      const activity = new Activity({
        doctor_id: editDoctor._id, // Use doctor's ID
        type: "Doctor updated there profile",
        details: "Doctor updated their profile information",
      });
      await activity.save();
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

const UpdateDoctorRegister = async (req, res) => {
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
  const id = req.user.userId;
  const updateData = req.body;

  const UpdateBankDetails = {
    BankName: updateData.BankName || null,
    BranchName: updateData.BranchName || null,
    Account_Number: updateData.Account_Number || null,
    AccountName: updateData.AccountName || null,
    Aadhar_no: updateData.Aadhar_no || null,
    Aadhar_image: null, // Initialize to null for now
    BranchAddress: updateData.BranchAddress || null,
    IFSC_code: updateData.IFSC_code || null,
    Pan_no: updateData.Pan_no || null,
    Pan_image: null, // Initialize to null for now
  };

  try {
    // Check if required data is provided
    if (
      !updateData.BankName ||
      !updateData.BranchName ||
      !updateData.Account_Number ||
      !updateData.AccountName ||
      !updateData.Aadhar_no ||
      !updateData.BranchAddress ||
      !updateData.IFSC_code ||
      !updateData.Pan_no
    ) {
      throw new Error("Required bank details are missing");
    }

    // Image upload to Cloudinary
    const aadharImage =
      req.files && req.files.Aadhar_image ? req.files.Aadhar_image[0] : null;
    const panImage =
      req.files && req.files.Pan_image ? req.files.Pan_image[0] : null;

    if (!aadharImage || !panImage) {
      throw new Error("Aadhar or Pan image not provided");
    }

    // Upload Aadhar image
    const aadharResult = await cloudinary.uploader.upload(aadharImage.path);
    if (!aadharResult || !aadharResult.secure_url) {
      throw new Error("Failed to upload Aadhar image to Cloudinary");
    }
    UpdateBankDetails.Aadhar_image = aadharResult.secure_url;

    // Upload Pan image
    const panResult = await cloudinary.uploader.upload(panImage.path);
    if (!panResult || !panResult.secure_url) {
      throw new Error("Failed to upload Pan image to Cloudinary");
    }
    UpdateBankDetails.Pan_image = panResult.secure_url;

    // Update doctor details
    const editDoctor = await Doctor.findOneAndUpdate(
      { user_id: id },
      UpdateBankDetails,
      {
        new: true,
      }
    );

    if (!editDoctor) {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Bank Account data successfully updated",
      success: true,
      data: editDoctor,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({
      message: "Failed to update Bank Account data",
      success: false,
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

const deleteDoctorBlock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userIdFromToken = req.user.userId;
  console.log(userIdFromToken, "userIdFromToken");
  try {
    // Check if the user making the request is an admin
    const adminUser = await User.findById(userIdFromToken);
    console.log(adminUser, "adminUser");
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
        success: false,
      });
    }

    // Find the user by userId
    const userToUpdate = await Doctor.findById(id);
    console.log(userToUpdate, "userToUpdate");
    if (!userToUpdate) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (userToUpdate.role === "admin") {
      return res.status(403).json({
        message: "Admin Doctor cannot be deleted.",
        status: false,
      });
    }

    // If the Doctor is not an admin, update status and permission
    userToUpdate.status = "Blocked";
    userToUpdate.permission = false;

    await userToUpdate.save();

    return res.status(201).json({
      message: "Doctor status updated successfully!",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update Doctor status!",
      status: false,
    });
  }
});

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

const FilterDoctors = async (req, res) => {
  try {
    // Extract filter criteria from the request query
    let {
      gender,
      fees,
      specialization_id,
      Total_Exp,
      search_data,
      Registered_Clinic_city,
      doctorNameStartsWith,
    } = req.query;
    // Build the filter object based on provided criteria

    // Convert to lowercase or uppercase for case-insensitive search
    gender = gender ? gender.toLowerCase() : gender;
    search_data = search_data ? search_data.toLowerCase() : search_data;
    Registered_Clinic_city = Registered_Clinic_city
      ? Registered_Clinic_city.toLowerCase()
      : Registered_Clinic_city;

    const filter = {};

    if (gender) filter.gender = gender;
    if (Registered_Clinic_city)
      filter.Registered_Clinic_city = Registered_Clinic_city;

    if (fees) {
      const [minFees, maxFees] = fees
        .split("-")
        .map((part) => (part ? parseInt(part) : undefined));
      if (minFees !== undefined && maxFees !== undefined) {
        filter.fees = { $gte: minFees, $lte: maxFees };
      } else if (minFees !== undefined) {
        filter.fees = { $gte: minFees, $lte: minFees };
      }
    }

    if (
      specialization_id &&
      mongoose.Types.ObjectId.isValid(specialization_id)
    ) {
      filter.Specailization = { _id: specialization_id };
      console.log(specialization_id, "jj");
      console.log(filter.Specialization, "filter.Specialization");
    }
    if (Total_Exp) {
      const [minExp, maxExp] = Total_Exp.split("-").map((part) =>
        part ? parseInt(part) : undefined
      );
      if (minExp !== undefined && maxExp !== undefined) {
        filter.Total_Exp = { $gte: minExp, $lte: maxExp };
      } else if (minExp !== undefined) {
        filter.Total_Exp = { $gte: minExp, $lte: minExp };
      }
    }

    if (search_data) {
      filter["$or"] = [
        { firstname: new RegExp(search_data, "i") },
        { lastname: new RegExp(search_data, "i") },
        { Registered_Clinic_address: new RegExp(search_data, "i") },
        { ClinicName: new RegExp(search_data, "i") },
        { Services: { $in: search_data.split(",") } },
      ];
    }

    // Filter by doctor's first name starting with a specific letter
    if (doctorNameStartsWith) {
      if (doctorNameStartsWith.match(/^[A-Za-z]$/)) {
        // Valid single character from A to Z or a to z
        filter.firstname = new RegExp("^" + doctorNameStartsWith, "i");
      } else {
        // Handle invalid input
        return res.status(400).json({
          message:
            "Invalid input for doctorNameStartsWith. Please provide a single character from A to Z or a to z.",
          status: false,
        });
      }
    } else {
      // If no specific letter is provided, match any character from A to Z
      filter.firstname = new RegExp("^[A-Za-z]", "i");
    }

    const doctors = await Doctor.find(filter)
      .select("-password")
      .populate("Specailization")
      .sort({ createdAt: -1 });

    const length = doctors.length;

    res.status(200).json({
      message: "Filtered doctor data retrieved successfully!",
      data: doctors,
      status: true,
      length,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
    });
  }
};

const search_specialities = async (req, res) => {
  try {
    const { specialityId } = req.params;

    console.log("Speciality ID received:", specialityId);

    // Assuming that your doctor model is named 'Doctor' and it has the 'Specailization' field
    const doctors = await Doctor.find({ Specailization: specialityId });
    const length = await doctors.length;
    res.status(200).json({
      message: "Doctors found successfully",
      doctors,
      length,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
      status: false,
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
  FilterDoctors,
  search_specialities,
  AllDoctorPermitted,
  AllDoctorApproved,
  AllDoctorBlocked,
  AllDoctorPending,
  deleteDoctorBlock,
};
