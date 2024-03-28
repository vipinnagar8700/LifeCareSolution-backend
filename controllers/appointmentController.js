const { generateToken } = require("../config/JwtToken");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const { Patient, Doctor } = require("../models/userModel");
const Slot = require("../models/slotModel");
const VideoSlot = require("../models/videoSlotModel");
require("dotenv/config");

const Payment = require("../models/paymentModel");
const Invoice = require("../models/invoiceModel");


const BookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, slot_id, videoSlot_id, date, type, amount, paymentMethod, transactionId } = req.body;

    // Check if payment details are incomplete for online payments
    if (paymentMethod === 'online' && (!amount || !transactionId)) {
      return res.status(400).json({
        message: "Payment details are incomplete.",
        success: false,
      });
    }
    const generateInvoiceId = () => {
      // Generating a numeric invoice ID
      const numericId = Math.floor(10000 + Math.random() * 90000); // Generates a random 5-digit number
      return `${numericId}`;
    };
    
    

    const invoiceId = generateInvoiceId();

    // Create a new Appointment with payment details
    const newAppointment = await Appointment.create({
      patient_id,
      doctor_id,
      slot_id,
      videoSlot_id,
      date,
      type,
      amount,
      payment: {
        method: paymentMethod,
        transactionId: paymentMethod === 'code' ? null : transactionId,
        status: 'pending', // Set an initial status if needed
      },
      invoice_id: invoiceId, // Include the generated invoice ID
      // Other appointment details
      // Other appointment details
    });

    const newInvoice = await Invoice.create({
      appointment_id: newAppointment._id,
      invoice_id: invoiceId,
      // Other invoice details
    });
    // Update the status of the associated slot to 'booked'
    await Slot.findByIdAndUpdate(slot_id, { status: 'booked' });
    await VideoSlot.findByIdAndUpdate(videoSlot_id, { status: 'booked' });

    // Extract payment details from the appointment
    const { payment } = newAppointment;

    // Create a new Payment using the Payment model for online payments
    if (paymentMethod === 'online') {
      const newPayment = await Payment.create({
        appointment_id: newAppointment._id,
        method: payment.method,
        transactionId: payment.transactionId,
        status: payment.status,
        amount: payment.amount,
        // Other payment details
      });

      // Optionally, you can update the appointment to include the payment's _id
      await Appointment.findByIdAndUpdate(newAppointment._id, { payment: newPayment._id });

      return res.status(201).json({
        message: "Appointment Successfully Booked!",
        success: true,
        data: {
          appointment: newAppointment,
          invoice: newInvoice,
        payment: newPayment

        },
      });
    }

    // If COD, return success response without creating a Payment entry
    return res.status(201).json({
      message: "Appointment Successfully Booked!",
      success: true,
      data: newAppointment,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to book Appointment.",
      success: false,
      error: error.message,
    });
  }
};

const TodayAppointment = async (req, res) => {
  try {
    // Get today's date in the format "DD-MM-YYYY"
     // Get today's date
     const today = new Date();

     // Format today's date as "DD-MM-YYYY"
     const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
 
console.log(formattedDate,"todayDate")
    // Find appointments with the date matching today's date
    const appointmentsToday = await Appointment.find({
      date: formattedDate, // Find appointments with the date matching today's date
    })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = appointmentsToday.length;

    res.status(200).json({
      message: "Appointments created today retrieved successfully!",
      data: appointmentsToday,
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

const PastAppointment = async (req, res) => {
  try {
    // Get today's date in the format "DD-MM-YYYY"
     // Get today's date
     const today = new Date();

     // Format today's date as "DD-MM-YYYY"
     const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
 
console.log(formattedDate,"todayDate")
    // Find appointments with the date matching today's date
    const appointmentsToday = await Appointment.find({
      date: { $lt: formattedDate }, 
    })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = appointmentsToday.length;

    res.status(200).json({
      message: "Appointments created today retrieved successfully!",
      data: appointmentsToday,
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
const UpcomingAppointment = async (req, res) => {
  try {
    // Get today's date
    const today = new Date();

    // Format today's date as "DD-MM-YYYY"
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;

    // Find appointments with the date after today's date
    const upcomingAppointments = await Appointment.find({
      date: { $gt: formattedDate }, // Find appointments with the date after today's date
    })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = upcomingAppointments.length;

    res.status(200).json({
      message: "Upcoming appointments retrieved successfully!",
      data: upcomingAppointments,
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


const AllAppointments = async (req, res) => {
  try {
    const AppointmentA = await Appointment.find()
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 }); // Exclude the 'password' field;
    const length = Appointment.length;
    res.status(200).json([
      {
        message: "All Appointment data retrieved successfully!",
        data: AppointmentA,
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

const CompleteAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ status: "completed" })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = pendingAppointments.length;

    res.status(200).json({
      message: "Complete appointments data retrieved successfully!",
      data: pendingAppointments,
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

const CancelAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ status: "cancel" })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = pendingAppointments.length;

    res.status(200).json({
      message: "Complete appointments data retrieved successfully!",
      data: pendingAppointments,
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

const PendingAppointments = async (req, res) => {
  try {
    const pendingAppointments = await Appointment.find({ status: "pending" })
      .populate("slot_id")
      .populate("doctor_id")
      .populate("patient_id")
      .populate("videoSlot_id").sort({ createdAt: -1 });

    const length = pendingAppointments.length;

    res.status(200).json({
      message: "Pending appointments data retrieved successfully!",
      data: pendingAppointments,
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

const editAppointment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const AppointmentA = await Appointment.findById(id)
      .populate("slot_id")
      .populate("videoSlot_id")
    console.log(AppointmentA); // Exclude the 'password' field
    if (!Appointment) {
      res.status(404).json({
        // Correct the status code to 404 (Not Found)
        message: "Appointment was not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        // Correct the status code to 200 (OK)
        message: "Data successfully Retrieved!",
        success: true,
        data: AppointmentA,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve Data!",
      success: false, // Correct the key to 'success'
    });
  }
};

const UpdateAppointment = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body; // Assuming you send the updated data in the request body

  // Make sure to exclude the 'role' field from the updateData

  try {
    const editAppointment = await Appointment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select("-password");

    if (!editAppointment) {
      res.status(200).json({
        message: "Appointment was not found!",
      });
    } else {
      res.status(201).json({
        message: "Data successfully updated!",
        success: true,
        data: editAppointment,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to update data!",
      status: false,
    });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the Appointment by ID
    const AppointmentA = await Appointment.findById(id);

    if (!AppointmentA) {
      return res.status(200).json({
        message: "Appointment was not found!",
      });
    }

    // If the Appointment is not an admin, proceed with the deletion
    const deletedAppointment = await Appointment.findByIdAndDelete(id).sort({ createdAt: -1 });

    if (!deletedAppointment) {
      return res.status(200).json({
        message: "Appointment was not found!",
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

const doctor_appointments = async (req, res) => {
  const { id } = req.params;

  try {
    // Retrieve appointments for the given doctor
    const appointments = await Appointment.find({ doctor_id: id })
      .populate("doctor_id")
      .populate("patient_id")
      .populate("slot_id")
      .populate("videoSlot_id")
      .sort({ createdAt: -1 }) // Sort by date in descending order
      .exec();

    const length = appointments.length;

    // Check if appointments exist
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        message: "No appointments found for the doctor!",
        success: false,
      });
    }

    res.status(200).json({
      message: "Appointments by doctor retrieved successfully!",
      data: appointments,
      length,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve data!",
      success: false,
    });
  }
};

const Patient_appointments = async (req, res) => {
  const { id } = req.params;

  try {
    const appointments = await Appointment.find({ patient_id: id })
      .populate("doctor_id")
      .populate("patient_id")
      .populate("slot_id")
      .populate("videoSlot_id")
      .sort({ createdAt: -1 })
      .exec();
       // Sort by date in descending order;
    const length = appointments.length;

    // Check if appointments exist

    res.status(200).json({
      message: "Appointments by doctor retrieved successfully!",
      data: appointments,
      length,
      status: true,
    });
  } catch (error) {
    console.log(error);
  }
};


const PatientChats = async (req, res) => {
  const { id } = req.params;

  try {
    const ChatUsers = await Appointment.aggregate([
      {
        $group: {
          _id: "$doctor_id",
          appointment: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users", // Assuming the user details are in the "users" collection
          localField: "_id",
          foreignField: "_id",
          as: "doctor"
        }
      },
      {
        $unwind: "$doctor"
      },
      {
        $lookup: {
          from: "users", // Assuming the user details are in the "users" collection
          localField: "appointment.patient_id",
          foreignField: "_id",
          as: "patient"
        }
      },
      {
        $unwind: "$patient"
      },
      {
        $sort: { "appointment.createdAt": -1 }
      }
    ]).exec();

    const length = ChatUsers.length;

    res.status(200).json({
      message: "Chats by patient retrieved successfully!",
      data: ChatUsers,
      length,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to retrieve chats.",
      status: false,
      error: error.message,
    });
  }
};


const UpdateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    let message = "";
    let slotStatus = "";
    let VideoslotStatus = "";

    switch (status) {
      case "accept":
        message = "Appointment accepted successfully!";
        slotStatus = "processing";
        VideoslotStatus = "processing";

        break;
      case "cancel":
        message = "Appointment canceled successfully!";
        slotStatus = "pending";
        VideoslotStatus = "pending";
        break;
      case "completed":
        message = "Appointment completed successfully!";
        slotStatus = "pending";
        VideoslotStatus = "pending";
        break;
      default:
        message = "Appointment status updated successfully!";
    }

    // Update the status of the associated slot
    if (slotStatus) {
      console.log(updatedAppointment, "updatedAppointment");
      await Slot.findByIdAndUpdate(updatedAppointment.slot_id, {
        status: slotStatus,
      });
    }
    if (VideoslotStatus) {
      console.log(updatedAppointment, "updatedAppointment");
      await VideoSlot.findByIdAndUpdate(updatedAppointment.videoSlot_id, {
        status: VideoslotStatus,
      });
    }

    if (!updatedAppointment) {
      res.status(404).json({
        message: "Appointment was not found!",
        success: false,
      });
    } else {
      res.status(200).json({
        message: message,
        success: true,
        data: updatedAppointment,
      });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    res.status(500).json({
      message: "Failed to update Appointment status!",
      success: false,
      error: error.message, // Provide the error message in the response
    });
  }
};

const AllChatUsers = async (req, res) => {
  try {
    const appointments = await Appointment.find({
     "type": "Video"
    })
    .populate("doctor_id")
    .populate("patient_id")
    .sort({ createdAt: -1 });

    const length = appointments.length;

    res.status(200).json({
      message: "AllUsers for Chats",
      data: appointments,
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

// For Patient
const AllChatDoctors = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the doctor's ID is passed in the URL parameters

    // Find appointments for the specific doctor ID and type "Video"
    const appointments = await Appointment.find({
      "type": "Video",
      "doctor_id": id
    })
    .populate("doctor_id")
    .populate("patient_id")
    .sort({ createdAt: -1 });

    // Extract unique patient IDs from appointments
    const uniquePatientIds = [...new Set(appointments.map(appointment => appointment.doctor_id))];

    // Filter appointments to include only unique patient IDs

    const length = uniquePatientIds.length;

    res.status(200).json({
      message: "All Doctor for Chats",
      data: uniquePatientIds,
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

// For Doctor
const AllChatPatient = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the patient's ID is passed in the URL parameters

    // Find appointments for the specific patient ID and type "Video"
    const appointments = await Appointment.find({
      "type": "Video",
      "patient_id": id
    })
    .populate("doctor_id")
    .populate("patient_id")
    .sort({ createdAt: -1 });

    // Extract unique patient IDs from appointments
    const uniquePatientIds = [...new Set(appointments.map(appointment => appointment.patient_id))];

    const length = uniquePatientIds.length;

    res.status(200).json({
      message: "All Patient for Chats",
      data: uniquePatientIds,
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



module.exports = {
  AllAppointments,AllChatUsers,
  editAppointment,
  UpdateAppointment,
  deleteAppointment,
  BookAppointment,AllChatDoctors,AllChatPatient,
  doctor_appointments,
  UpdateAppointmentStatus,PatientChats,
  Patient_appointments,TodayAppointment,CompleteAppointments,PendingAppointments,CancelAppointments,PastAppointment,UpcomingAppointment
};
