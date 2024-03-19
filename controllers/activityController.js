const Activity = require('../models/activityModel');
const { User } = require('../models/userModel');

// Get all activities
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find().populate("doctor_id");

        // Calculate the lengths for read and unread activities
        const readActivities = activities.filter(activity => activity.isRead);
        const unreadActivities = activities.filter(activity => !activity.isRead);

        res.status(200).json({
            message: "Activities retrieved successfully",
            success: true,
            data: activities,
            ReadActivities: readActivities.length,
            UnreadActivities: unreadActivities.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve activities",
            success: false,
            error: error.message
        });
    }
};

  


 
  const markActivityAsRead = async (req, res) => {
    try {
        const doctorId = req.params.id; // Assuming the doctor's ID is passed in the request parameters
        const userId = req.user.userId; // Assuming your middleware sets the user ID in req.user.id
console.log(doctorId)
        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            return res.status(403).json({
                message: "Unauthorized access denied you don't have access!",
                success: false
            });
        }

        // Find the activity associated with the doctor's ID and update its isRead field
        const activity = await Activity.findOneAndUpdate({ doctor_id: doctorId }, { isRead: true }, { new: true });
        if (!activity) {
            return res.status(404).json({
                message: "Activity not found for the specified doctor",
                success: false
            });
        }

        res.status(200).json({
            message: "Activity marked as read",
            success: true,
            data: activity
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to mark activity as read",
            success: false,
            error: error.message
        });
    }
};



module.exports = {
    getAllActivities,markActivityAsRead
  };