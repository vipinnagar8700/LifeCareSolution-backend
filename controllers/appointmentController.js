const { generateToken } = require("../config/JwtToken");
const Appointment = require("../models/appointmentModel");
const asyncHandler = require("express-async-handler");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { Patient, Doctor } = require("../models/userModel");
const Slot = require("../models/slotModel");
require("dotenv/config");

const BookAppointment = async (req, res) => {
  try {
    const { patient_id, doctor_id, slot_id, date } = req.body;

    // Create a new Appointment
    const newAppointment = await Appointment.create(req.body);

    // Update the status of the associated slot to 'booked'
    await Slot.findByIdAndUpdate(slot_id, { status: 'booked' });

    res.status(201).json({
      message: "Appointment Successfully Booked!",
      success: true,
      data: newAppointment,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    res.status(500).json({
      message: "Failed to book Appointment.",
      success: false,
      error: error.message, // Provide the error message in the response
    });
  }
};


const AllAppointments = async (req, res) => {
  try {
    const AppointmentA = await Appointment.find(); // Exclude the 'password' field;
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

const editAppointment = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const AppointmentA = await Appointment.findById(id);
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
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

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
  console.log(id);

  try {
    // Retrieve appointments for the given doctor
    const appointments = await Appointment.find({ doctor_id: id }).populate('doctor_id').populate('patient_id').populate('slot_id').exec();
    const length = appointments.length;

    // Check if appointments exist
    if (!appointments || appointments.length === 0) {
      return res.status(404).json({
        message: "No appointments found for the doctor!",
        success: false,
      });
    }

    // Retrieve patient details for each appointment
   


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
  try {
    const { id } = req.params;
    const appointments = await Appointment.find({ patient_id: id }).populate('doctor_id').populate('patient_id').populate('slot_id').exec();;
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

const UpdateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: status },
      { new: true }
    );

    let message = '';
    let slotStatus = '';

    switch (status) {
      case 'accept':
        message = 'Appointment accepted successfully!';
        slotStatus = 'processing';
        break;
      case 'cancel':
        message = 'Appointment canceled successfully!';
        slotStatus = 'pending';
        break;
      case 'completed':
        message = 'Appointment completed successfully!';
        slotStatus = 'pending';
        break;
      default:
        message = 'Appointment status updated successfully!';
    }

    // Update the status of the associated slot
    if (slotStatus) {
      console.log(updatedAppointment,"updatedAppointment")
      await Slot.findByIdAndUpdate(updatedAppointment.slot_id, { status: slotStatus });
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


module.exports = {
  AllAppointments,
  editAppointment,
  UpdateAppointment,
  deleteAppointment,
  BookAppointment,
  doctor_appointments,
  UpdateAppointmentStatus,
  Patient_appointments,
};
