const { generateToken } = require('../config/JwtToken');
const VideoSlot  = require('../models/videoSlotModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const AddVideoSlot = async (req, res) => {
    try {
        const { time_duration, day, start_time, end_time, doctor_id } = req.body;

        // Create a new VideoSlot
        const newVideoSlot = await VideoSlot.create(req.body);

        res.status(201).json({
            message: "VideoSlot Successfully Created!",
            success: true,
            data: newVideoSlot,
        });
    } catch (error) {
        console.error(error); // Log the error for debugging purposes

        res.status(500).json({
            message: "Failed to create VideoSlot.",
            success: false,
            error: error.message, // Provide the error message in the response
        });
    }
};


const AllVideoSlots = async (req, res) => {

    const {id} = req.params;
    try {
        const VideoSlotA = await VideoSlot.find({doctor_id:id}).sort({ createdAt: -1 }); // Exclude the 'password' field;
        const length = VideoSlot.length;
        res.status(200).json([{
            message: "All VideoSlot data retrieved successfully!",
            data: VideoSlotA,
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

const editVideoSlot = async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const VideoSlotA = await VideoSlot.findById(id);
        console.log(VideoSlotA)// Exclude the 'password' field
        if (!VideoSlot) {
            res.status(404).json({  // Correct the status code to 404 (Not Found)
                message: "VideoSlot was not found!",
                success: false,
            });
        } else {
            res.status(200).json({  // Correct the status code to 200 (OK)
                message: "Data successfully Retrieved!",
                success: true,
                data: VideoSlotA
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve Data!",
            success: false,  // Correct the key to 'success'
        });
    }
}


const UpdateVideoSlot = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Assuming you send the updated data in the request body

    // Make sure to exclude the 'role' field from the updateData

    try {
        const editVideoSlot = await VideoSlot.findByIdAndUpdate(id, updateData, { new: true }).select('-password');

        if (!editVideoSlot) {
            res.status(200).json({
                message: "VideoSlot was not found!",
            });
        } else {
            res.status(201).json({
                message: "Data successfully updated!",
                success: true,
                data: editVideoSlot
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Failed to update data!",
            status: false
        });
    }
}

const deleteVideoSlot = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the VideoSlot by ID
        const VideoSlotA = await VideoSlot.findById(id);

        if (!VideoSlotA) {
            return res.status(200).json({
                message: "VideoSlot was not found!",
            });
        }
        // If the VideoSlot is not an admin, proceed with the deletion
        const deletedVideoSlot = await VideoSlot.findByIdAndDelete(id);

        if (!deletedVideoSlot) {
            return res.status(200).json({
                message: "VideoSlot was not found!",
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
    AllVideoSlots, editVideoSlot, UpdateVideoSlot, deleteVideoSlot,AddVideoSlot
}