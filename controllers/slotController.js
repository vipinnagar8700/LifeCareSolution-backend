const { generateToken } = require('../config/JwtToken');
const Slot  = require('../models/slotModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const AddSlot = async (req, res) => {
    try {
        const { time_duration, day, start_time, end_time, doctor_id } = req.body;

        // Create a new slot
        const newSlot = await Slot.create(req.body);

        res.status(201).json({
            message: "Slot Successfully Created!",
            success: true,
            data: newSlot,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        res.status(500).json({
            message: "Failed to create slot.",
            success: false,
            error: error.message, // Provide the error message in the response
        });
    }
};


const AllSlots = async (req, res) => {

    const {id} = req.params;
    try {
        const SlotA = await Slot.find({doctor_id:id}).sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = Slot.length;
        res.status(200).json([{
            message: "All Slot data retrieved successfully!",
            data: SlotA,
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

const editSlot = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const SlotA = await Slot.findById(id);
        console.log(SlotA)// Exclude the 'password' field
        if (!Slot) {
            res.status(404).json({  // Correct the status code to 404 (Not Found)
                message: "Slot was not found!",
                success: false,
            });
        } else {
            res.status(200).json({  // Correct the status code to 200 (OK)
                message: "Data successfully Retrieved!",
                success: true,
                data: SlotA
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
        });
    }
}


const UpdateSlot = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editSlot = await Slot.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!editSlot) {
            res.status(200).json({
                message: "Slot was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editSlot
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

const deleteSlot = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the Slot by ID
        const SlotA = await Slot.findById(id);

        if (!SlotA) {
            return res.status(200).json({
                message: "Slot was not found!",
            });
        }


        // If the Slot is not an admin, proceed with the deletion
        const deletedSlot = await Slot.findByIdAndDelete(id);

        if (!deletedSlot) {
            return res.status(200).json({
                message: "Slot was not found!",
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

module.exports = {
    AllSlots, editSlot, UpdateSlot, deleteSlot,AddSlot
}