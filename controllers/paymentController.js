const { generateToken } = require("../config/JwtToken");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { Patient, Doctor } = require("../models/userModel");
const Slot = require("../models/slotModel");
const VideoSlot = require("../models/videoSlotModel");
require("dotenv/config");

const Payment = require("../models/paymentModel");

const AllPayments = async (req, res) => {
  try {
    const PaymentDetails = await Payment.find().populate({
        path: 'appointment_id',
        populate: [
          { path: 'patient_id' },
          { path: 'doctor_id' },
          { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
        ],
      });

      // Exclude the 'PaymentDetails' field;
    const length = Appointment.length;
    res.status(200).json([
      {
        message: "All PaymentDetails data retrieved successfully!",
        data: PaymentDetails,
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

const AllDoctorPayment = async (req, res) => {
    const {id} = req.params;
    try {
      const PaymentDetails = await Payment.find({ 'appointment_id.doctor_id': id,}).populate({
          path: 'appointment_id',
          populate: [
            { path: 'patient_id' },
            { path: 'doctor_id' },
            { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
          ],
        });
  
        // Exclude the 'PaymentDetails' field;
      const length = Appointment.length;
      res.status(200).json([
        {
          message: "All PaymentDetails data retrieved successfully!",
          data: PaymentDetails,
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





module.exports = {
    AllPayments
};
