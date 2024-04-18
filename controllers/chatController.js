const Chat = require('../models/ChatModel');
const io = require('../config/socket'); // Assuming you have a separate file for socket.io setup






const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});

// Route for sending chat
const SendMessages = async (req, res) => {
    try {
        const { sender, receiver, content, chatType, latitude, longitude, numPages } = req.body;
        let fileName, fileSize;

        // Check if file is uploaded
        if (req.file) {
            console.log(req.file,"req.file")
            // Upload file to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, { folder: 'chat-images' });
            console.log(result,"result")
            fileName = result.secure_url;
            fileSize = result.bytes;
        }
        // Create a new chat message
        const newChat = new Chat({
            sender,
            receiver,
            content,
            chatType,
            latitude,
            longitude,
            image: fileName, // Save file URL as image
            timestamp: new Date(),
        });

        // Save the new chat message
        await newChat.save();

        // Emit the new chat to all connected clients
        io.emit('chat', newChat);

        // Respond with success message
        return res.status(200).json({
            message: 'Message Sent Successfully',
            success: true
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: error.message || "Something went wrong", success: false });
    }
};



// Route for getting chats
const GetMessages = async (req, res) => {
    try {
        const chats = await Chat.find().populate("sender").populate("receiver").sort({ timestamp: 1 });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Mark Message as Read API
const markMessageAsRead = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have authentication middleware to get the user ID

        // Update all messages received by the user to mark them as read
        await Chat.updateMany(
            { receiver: userId },
            { $addToSet: { readByReceiver: userId } }
        );

        // Decrement unreadMessages count for the user
        await ChatUsers.updateOne(
            { patient: userId },
            { $set: { unreadMessages: 0 } } // Set unreadMessages to 0
        );

        res.status(200).json({ message: 'All messages marked as read' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const DeleteAllChats = async (req, res) => {
    try {
        // Delete all chat data from the database
        await Chat.deleteMany({});

        // Emit a message to all connected clients that all chats have been deleted
        io.emit('chats_deleted');

        return res.status(200).json({
            message: 'All chat data deleted successfully',
            success: true,
        });
    } catch (error) {
        console.error('Error deleting chat data:', error);
        res.status(500).json({ message: 'Server error', success: false });
    }
};


// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // You can handle various events here, like joining rooms, disconnecting, etc.
    // For example, if you want to handle disconnection:
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

module.exports = { SendMessages, GetMessages ,markMessageAsRead,DeleteAllChats};
