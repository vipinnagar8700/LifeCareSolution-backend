const { generateToken } = require("../config/JwtToken");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { Patient, Doctor } = require("../models/userModel");
const Slot = require("../models/slotModel");
const VideoSlot = require("../models/videoSlotModel");
require("dotenv/config");

const Invoice = require("../models/invoiceModel");

const AllInvoices = async (req, res) => {
    const { id } = req.params;
  try {
    const InvoiceDetails = await Invoice.find().populate({
        path: 'appointment_id',
        populate: [
          { path: 'patient_id' },
          { path: 'doctor_id' },
          { path: 'videoSlot_id' }, // Assuming 'videoSlot_id' is a reference to the slot
        ],
      }).sort({ createdAt: -1 });

      // Exclude the 'PaymentDetails' field;
    const length = InvoiceDetails.length;
    res.status(200).json([
      {
        message: "All InvoiceDetails data retrieved successfully!",
        data: InvoiceDetails,
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

const AllDoctorInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const InvoiceDetails = await Invoice.find({ 'appointment_id.doctor_id._id': id })
        .populate('appointment_id', 'patient_id doctor_id').sort({ createdAt: -1 }); // Specify the fields to populate

            

        const length = InvoiceDetails.length;
        const message = length > 0
            ? "All InvoiceDetails data retrieved successfully!"
            : "No InvoiceDetails data found for the specified doctor_id.";

        res.status(200).json([
            {
                message,
                data: InvoiceDetails,
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



const AllPatientInvoice  =  async (req, res) => {
    const { id } = req.params;
    try {
        const InvoiceDetails = await Invoice.find({ 'appointment_id.patient_id._id': id })
        .populate('appointment_id', ' doctor_id').sort({ createdAt: -1 }); // Specify the fields to populate

            

        const length = InvoiceDetails.length;
        const message = length > 0
            ? "All InvoiceDetails data retrieved successfully!"
            : "No InvoiceDetails data found for the specified patient_id.";

        res.status(200).json([
            {
                message,
                data: InvoiceDetails,
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

}








module.exports = {
    AllInvoices,AllDoctorInvoice,AllPatientInvoice
};
