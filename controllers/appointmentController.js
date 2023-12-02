const { generateToken } = require('../config/JwtToken');
const Appointment = require('../models/appointmentModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const BookAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, slot_id, date } = req.body;

        // Create a new Appointment
        const newAppointment = await Appointment.create(req.body);

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
        res.status(200).json([{
            message: "All Appointment data retrieved successfully!",
            data: AppointmentA,
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

const editAppointment = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const AppointmentA = await Appointment.findById(id);
        console.log(AppointmentA)// Exclude the 'password' field
        if (!Appointment) {
            res.status(404).json({  // Correct the status code to 404 (Not Found)
                message: "Appointment was not found!",
                success: false,
            });
        } else {
            res.status(200).json({  // Correct the status code to 200 (OK)
                message: "Data successfully Retrieved!",
                success: true,
                data: AppointmentA
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
        });
    }
}


const UpdateAppointment = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editAppointment = await Appointment.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!editAppointment) {
            res.status(200).json({
                message: "Appointment was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editAppointment
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

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
}

const doctor_appointments = async (req, res) => {
    const { id } = req.params;
        console.log(id)
    try {
        
        const appointments = await Appointment.find({ doctor_id: id });
        console.log(appointments)
        res.status(200).json({
            message: "Appointments by doctor retrieved successfully!",
            data: appointments,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
        });
    }
};


const Patient_appointments = async (req, res) => {
    try {
        const { id } = req.params;
        const appointments = await Appointment.find({ patient_id: id });
        res.status(200).json({
            message: "Appointments by patient retrieved successfully!",
            data: appointments,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
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

        if (!updatedAppointment) {
            res.status(404).json({
                message: "Appointment was not found!",
                success: false,
            });
        } else {
            res.status(200).json({
                message: "Appointment status updated successfully!",
                success: true,
                data: updatedAppointment,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update Appointment status!",
            success: false,  // Correct the key to 'success'
        });
    }
};

module.exports = {
    AllAppointments, editAppointment, UpdateAppointment, deleteAppointment, BookAppointment, doctor_appointments, UpdateAppointmentStatus, Patient_appointments
}