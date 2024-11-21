const admin = require('firebase-admin');
const Notification = require('../models/NotificationModel');
const { Patient } = require('../models/userModel');

const sendNotification = async (recipientId, title, body, token, type = 'general',patient_id, doctor_id) => {
    console.log(recipientId, title, body, token, type = 'general',patient_id, doctor_id,"sss")
  const message = {
    notification: {
      title,
      body,
    },
    token, // Dynamic token passed from the register function
  };

  try {
    // Send the notification using Firebase
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);

    // Log the successful notification in the database
    const newNotification = await Notification.create({
      recipient: recipientId,
      title,
      body,
      type,
      token,
      status: 'sent',patient_id, doctor_id
    });
console.log(newNotification,"newNotificationnewNotification")
    return { success: true, data: newNotification };
  } catch (error) {
    console.error('Error sending notification:', error);

    // Log the failed notification in the database
    const failedNotification = await Notification.create({
      recipient: recipientId,
      title,
      body,
      type,
      token,
      status: 'failed',patient_id, doctor_id
    });

    return { success: false, error: error.message, data: failedNotification };
  }
};


const GetNotify = async (req, res) => {
    try {
      // Handle pagination: set default page and limit if not provided
      const { page = 1, limit = 10 } = req.query;
      // Fetch notifications with pagination
      const notifications = await Notification.find()
      .populate("doctor_id")
      .populate("patient_id")
        .sort({ createdAt: -1 }) // Sort by most recent
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(parseInt(limit)) // Limit the number of results
       
    
      // Get the total count of notifications
      const total = await Notification.countDocuments();
    
      // Count the number of read and unread notifications
      const readCount = await Notification.countDocuments({ isRead: true });
      const unreadCount = await Notification.countDocuments({ isRead: false });
    console.log(unreadCount,"unreadCount")
      // Respond with the data, including the counts
      res.status(200).json({
        success: true,
        data: notifications,
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        readCount,
        unreadCount,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications.",
        error: error.message,
      });
    }
  };
  

module.exports = {
  sendNotification,GetNotify
};
