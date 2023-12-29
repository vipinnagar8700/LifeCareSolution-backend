const { generateToken } = require("../config/JwtToken");
const {
  User,
  Doctor,
  Patient,
  Pharmacy,
  Role,
} = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const multer = require("multer");
const path = require("path");

const register = asyncHandler(async (req, res) => {
  const { email, mobile, password, role } = req.body;
  console.log(email, mobile, password, role);
  // Check if a user with the given email or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (!existingUser) {
    // User does not exist, so create a new user
    const newUser = await User.create({
      email,
      mobile,
      password,
      role,
    });

    // Add role-specific data based on the role
    let roleData;

    if (role === "doctor") {
      roleData = await Doctor.create({
        user_id: newUser._id,
        // Add the necessary fields for the Student model here
        password: newUser.password, // Assuming this is the password from newUser
        mobile: newUser.mobile,
        email: newUser.email,
        role: newUser.role,
        Education: null, // Replace this with the actual array of education data
        experience: null, // Replace this with the actual array of experience data
        Registrations: null,
      });
    } else if (role === "patient") {
      roleData = await Patient.create({
        user_id: newUser._id,
        // Add the necessary fields for the Student model here
        password: newUser.password, // Assuming this is the password from newUser
        mobile: newUser.mobile,
        email: newUser.email,
        role: newUser.role,
      });
    } else if (role === "pharmacy") {
      roleData = await Pharmacy.create({
        user_id: newUser._id,
        // Add the necessary fields for the Student model here
        password: newUser.password, // Assuming this is the password from newUser
        mobile: newUser.mobile,
        email: newUser.email,
        role: newUser.role,
      });
    }

    res.status(201).json({
      message: "Successfully Registered!",
      success: true,
    });
  } else {
    // User with the same email or phone already exists
    const message =
      existingUser.email === email
        ? "Email is already registered."
        : "Mobile number is already registered.";
    res.status(409).json({
      message,
      success: false,
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, mobile, password, role } = req.body;

  let findUser;

  // Check if a user with the given email or mobile exists and matches the role
  if (role) {
    findUser = await User.findOne({
      $and: [{ $or: [{ email }, { mobile }] }, { role }],
    });
  } else {
    findUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
  }

  if (findUser && (await findUser.isPasswordMatched(password))) {
    if (
      findUser.role !== "patient" &&
      findUser.role !== "admin" &&
      findUser.role !== "doctor" &&
      !findUser.permission
    ) {
      return res.status(401).json({
        message: "You don't have permission to login",
        success: false,
      });
    } else {
      const token = generateToken(findUser._id);
      const refreshToken = generateRefreshToken(findUser._id);
      const updateUser = await User.findByIdAndUpdate(
        findUser._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      const response = {
        _id: findUser._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        status: findUser.status,
        address: findUser.address,
        city: findUser.city,
        state: findUser.state,
        role: findUser.role,
        token: token,
      };
      if (findUser.role === "doctor") {
        response.doctorData = await Doctor.findOne({ user: findUser._id });
      } else if (findUser.role === "patient") {
        response.patientData = await Patient.findOne({ user: findUser._id });
      } else if (findUser.role === "pharmacy") {
        response.pharmacyData = await Pharmacy.findOne({ user: findUser._id });
      }

      res.status(200).json({
        message: "Successfully Login!",
        data: response,
      });
    }
  } else {
    res.status(401).json({
      message: "Invalid Credentials!",
      success: false,
    });
  }
});

const AllUsers = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password"); // Exclude the 'password' field;
    const length = patients.length;
    res.status(200).json([
      {
        message: "All Users data retrieved successfully!",
        data: patients,
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


const editUser = async (req, res) => {
  const { id } = req.params;
  try {
    const editUser = await Patient.findOne({ user_id: id }); // Exclude the 'password' field
    if (!editUser) {
      res.status(200).json({
        message: "User was not found!",
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

const UpdateUsers = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body
  const file = req.file;
  console.log(file, "aa");
  if (file) {
    updateData.image = file.filename; // Add the filename to the updateData object
  }
  const domain = 'https://viplifecaresolution.onrender.com';

  // Replace backslashes with forward slashes and remove leading './'
  const relativePath = file.path.replace(/\\/g, '/').replace(/^\.\//, '');
  
  // Construct the full image URL
  const imageUrl = `${domain}/${relativePath}`;
  
  console.log(imageUrl);
  delete updateData.role;

  try {



    const finding = await  Patient.findOne({user_id:id})
    console.log(finding)

    const editUser = await Patient.findByIdAndUpdate(finding._id, updateData, {
      new: true,
    }).select("-password");

    if (!editUser) {
      res.status(200).json({
        message: "User was not found!",
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

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(200).json({
        message: "User was not found!",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin users cannot be deleted.",
        status: false,
      });
    }

    // If the user is not an admin, proceed with the deletion
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(200).json({
        message: "User was not found!",
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

const Accept_User = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(id);

  // Check if the user making the request is an admin
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "You don't have permission to perform this action",
      success: false,
    });
  }

  try {
    // Find the user by userId
    const user = await Doctor.findOne({user_id:id});
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update the user's permission to true
    user.permission = true;
    await user.save();

    res.status(200).json({
      message: "Permission Granted successfully!",
      success: true,
      data: { id, permission: true },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});

module.exports = {
  register,
  login,
  AllUsers,
  editUser,
  UpdateUsers,
  deleteUser,
  Accept_User,
};
