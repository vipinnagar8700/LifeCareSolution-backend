const { generateToken } = require("../config/JwtToken");
// Import the Twilio module
const twilio = require('twilio');
const {
  User,
  Doctor,
  Patient,
  Pharmacy,
  Role,
} = require("../models/userModel");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require("dotenv/config");
const multer = require("multer");
const path = require("path");
const firebase = require("firebase-admin");
const cloudinary = require("cloudinary").v2;
const { v4: uuidv4 } = require('uuid');
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

const serviceAccount = require("../config/lifecaresolution-984c5-firebase-adminsdk-20orx-a1a89421cf.json"); // Path to the downloaded JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Twilio client with your Account SID and Auth Token
const accountSid = 'AC02c672773f1ebe0652d671126c189f8e';
const authToken = 'ebd8704fc5403d9d266024e0bb857969';
const client = twilio(accountSid, authToken);


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
 // Generate the password reset token
 await newUser.createPasswordResetToken();

 // Save the user with the generated token
 await newUser.save();

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
      data:newUser
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



const register_admin = asyncHandler(async (req, res) => {
  const {firstname, lastname,email, mobile, password, role,address,city,state,gender,UserName ,pincode} = req.body;
  console.log(email, mobile, password, role);
  // Check if a user with the given email or phone already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (!existingUser) {
    // User does not exist, so create a new user
    const newUser = await User.create({
      firstname, lastname,email, mobile, password, role,address,city,state,gender,UserName ,pincode

    });
 // Generate the password reset token
 await newUser.createPasswordResetToken();

 // Save the user with the generated token
 await newUser.save();

    // Add role-specific data based on the role
    let roleData;

    if (role === "doctor") {
      roleData = await Doctor.create({
        user_id: newUser._id,
        firstname:newUser.firstname,
        lastname:newUser.lastname,
        address:newUser.address,
        city:newUser.city,
        state:newUser.state,
        gender:newUser.gender,
        UserName:newUser.UserName,pincode:newUser.pincode,
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
        firstname:newUser.firstname,
        lastname:newUser.lastname,
        address:newUser.address,
        city:newUser.city,
        state:newUser.state,
        gender:newUser.gender,
        UserName:newUser.UserName,pincode:newUser.pincode,
      });
    } else if (role === "pharmacy") {
      roleData = await Pharmacy.create({
        user_id: newUser._id,
        // Add the necessary fields for the Student model here
        password: newUser.password, // Assuming this is the password from newUser
        mobile: newUser.mobile,
        email: newUser.email,
        role: newUser.role,
        firstname:newUser.firstname,
        lastname:newUser.lastname,
        address:newUser.address,
        city:newUser.city,
        state:newUser.state,
        gender:newUser.gender,
        UserName:newUser.UserName,pincode:newUser.pincode,
      });
    }

    res.status(201).json({
      message: "Successfully Registered!",
      success: true,
      data:newUser
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
      findUser.role == "doctor" &&
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
        passwordResetToken:findUser.passwordResetToken,
        permission:findUser.permission
      };
      if (findUser.role === "doctor") {
        response.doctorData = await Doctor.findOne({ user_id: findUser._id });
      } else if (findUser.role === "patient") {
        response.patientData = await Patient.findOne({ user_id: findUser._id });
      } else if (findUser.role === "pharmacy") {
        response.pharmacyData = await Pharmacy.findOne({ user: findUser._id });
      }
       // Send notification
       sendNotification(findUser);

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



// Function to generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTP = async (mobileNumber) => {
  try {
    const user = await User.findOne({ mobile: mobileNumber });
    if (!user) {
      // If user is not found, return an error
      return { success: false, message: 'User not found.' };
    }

    // Generate a random OTP
    const otp = generateOTP();

    // Store the OTP in the user object
    user.otp = otp;
    await user.save();

    // Format the mobile number to comply with E.164 format
    const formattedMobileNumber = `+91${mobileNumber}`; // Assuming the country code is '91' for India

    // Send an SMS using Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: '+12138982692', // Your Twilio phone number
      to: formattedMobileNumber, // Formatted mobile number
    });

    // Return success message
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    // Log and return error message
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Error sending OTP' };
  }
};




// Define the API endpoint for generating and sending OTP
const generateAndSendOTP = asyncHandler(async (req, res) => {
  // Extract mobile number from the request body
  const { mobileNumber } = req.body;

  try {
    // Send OTP
    const otp = await sendOTP(mobileNumber);

    // Send success response with the OTP
    res.json({ success: true, otp, message: 'OTP sent successfully' });
  } catch (error) {
    // Send error response if OTP sending fails
    console.error('Error generating and sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error generating and sending OTP' });
  }
});

const loginWithOTP = async (req, res) => {
  // Extract mobile number and OTP from the request body
  const { mobileNumber, otpuser } = req.body;

  try {
    // Fetch the user associated with the provided mobile number
    const user = await User.findOne({ mobile: mobileNumber });
    if (!user) {
      // If user is not found, return an error
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Perform OTP verification
    const isOTPVerified = verifyOTP(otpuser, user.otp); // Assuming user.otp contains the OTP stored in the database

    if (isOTPVerified) {
      // If OTP is verified, proceed with login
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      const updateUser = await User.findByIdAndUpdate(
        user._id,
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
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        status: user.status,
        address: user.address,
        city: user.city,
        state: user.state,
        role: user.role,
        token: token,
        passwordResetToken: user.passwordResetToken,
        permission: user.permission
      };

      if (
        user.role !== "patient" &&
        user.role !== "admin" &&
        user.role === "doctor" &&
        !user.permission
      ) {
        return res.status(401).json({
          message: "You don't have permission to login",
          success: false,
        });
      }

      if (user.role === "doctor") {
        response.doctorData = await Doctor.findOne({ user_id: user._id });
      } else if (user.role === "patient") {
        response.patientData = await Patient.findOne({ user_id: user._id });
      } else if (user.role === "pharmacy") {
        response.pharmacyData = await Pharmacy.findOne({ user: user._id });
      }

      // Send notification
      sendNotification(user);

      res.status(200).json({
        message: "Successfully Login!",
        data: response,
      });
    } else {
      // If OTP is not verified, return error message
      res.status(400).json({ success: false, message: 'Invalid OTP. Please try again.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};




// Function to verify OTP
const verifyOTP = (otp, otpuser) => {
  console.log(otpuser,"otpuserotpuser")
  console.log(otp,"otpuserotpuserotpuserotpuserotpuserotpuser")
  return otp === otpuser;
};

// Function to send notification using FCM
async function sendNotification(user) {
  try {
    // Construct the message payload
    console.log(user.deviceToken,"user.deviceToken")
    const message = {
      token: user.deviceToken, // The device token of the user's device
      notification: {
        title: 'Login Notification',
        body: 'You have successfully logged in!',
      },
    };

    // Send the message
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}


const AllUsers_role = async (req, res) => {
  try {
    const patients = await User.find().select("-password").sort({ createdAt: -1 }); // Exclude the 'password' field;
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

const AllUsers = async (req, res) => {
  try {
    const patients = await Patient.find().select("-password").sort({ createdAt: -1 }); // Exclude the 'password' field;
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

if (file) {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'LifeCareSolution', // Optional: You can specify a folder in your Cloudinary account
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
        message: "User was not found!",      success: false,
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
  const userIdFromToken = req.user.userId;
  
  try {
    // Check if the user making the request is an admin
    const adminUser = await User.findById(userIdFromToken);
    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({
        message: "You don't have permission to perform this action",
        success: false,
      });
    }

    // Find the user by userId
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the user making the request has the permission to update the target user
    if (userToUpdate.role === "admin") {
      return res.status(403).json({
        message: "You don't have permission to update another admin",
        success: false,
      });
    }

    // Toggle the permission value
    userToUpdate.permission = !userToUpdate.permission;
    await userToUpdate.save();

    let updatedEntity;
console.log(userToUpdate.role,"userToUpdate.role")
    // Update the corresponding table based on the user's role
    switch (userToUpdate.role) {
      case "doctor":
        // Update the doctor table
        console.log("User's id:", userToUpdate._id.toString());
        console.log("UuserToUpdate.permissiond:", userToUpdate.permission);
        
        updatedEntity = await Doctor.findOneAndUpdate(
          { user_id: userToUpdate._id },
          { permission: userToUpdate.permission },
          { new: true }
        );
        console.log(updatedEntity,"updatedEntity")
        break;
      case "lab":
        // Update the lab table
        updatedEntity = await Lab.findOneAndUpdate(
          { user_id: userToUpdate._id },
          { permission: userToUpdate.permission },
          { new: true }
        );
        break;
      case "pharmacy":
        // Update the pharmacy table
        updatedEntity = await Pharmacy.findOneAndUpdate(
          { user_id: userToUpdate._id },
          { permission: userToUpdate.permission },
          { new: true }
        );
        break;
        case "subadmin":
        // Update the pharmacy table
        updatedEntity = await SubAdmin.findOneAndUpdate(
          { user_id: userToUpdate._id },
          { permission: userToUpdate.permission },
          { new: true }
        );
        break;
      default:
        // Handle unknown role
        break;
    }

    // Handle the updated entity

    res.status(200).json({
      message: "Permission toggled successfully!",
      success: true,
      data: { id, permission: userToUpdate.permission },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
});




const changePassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  console.log(resetToken,"AAA")
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log( oldPassword, newPassword, confirmPassword ,"AAA")
  try {
    // Find the user by the reset token
    const user = await User.findOne({
      passwordResetToken: resetToken,
      passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
    });
console.log(resetToken,"AAA")
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token",status:false });
    }

    // Check if the old password is correct
    const isOldPasswordCorrect = await user.isPasswordMatched(oldPassword);

    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect",status:false });
    }

    // Check if the new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New password and confirmation do not match",status:false });
    }

    // Update the user's password
    user.password = newPassword;
    user.passwordChangeAt = new Date(); // Update the password change timestamp
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Save the updated user
await user.createPasswordResetToken();

    // Save the updated user
    await user.save();
    res.json({ message: "Password reset successful",status:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


const ResetPassword = asyncHandler(async(req,res)=>{
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found',     success: false });
    }

    // Create and save password reset token
    const resetToken = await user.createPasswordResetToken();
    await user.save();

    // Create a nodemailer transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'bonnie.olson0@ethereal.email',
        pass: 'Nu9vPVh1wmyvuMzzpM'
    }
    });

    // Compose the email message
    const mailOptions = {
      from: 'bonnie.olson0@ethereal.email',
      to: 'vipinnagar8700@gmail.com',
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:3000/reset/${resetToken}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent successfully' ,status:true});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:false });
  }
})


const New_password = asyncHandler(async(req,res)=>{
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // Check if the new password matches the confirmation
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirmation do not match' });
  }

  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }, // Ensure the token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful',status:true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:true });
  }
})



const payment = asyncHandler(async(req,res)=>{
  try {
    
  
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error',status:true });
  }
})

module.exports = {
  register,
  login,
  AllUsers,
  editUser,
  UpdateUsers,
  deleteUser,
  Accept_User,
  changePassword,register_admin,ResetPassword,New_password,payment,AllUsers_role,loginWithOTP,generateAndSendOTP
};
