
const ChatUsers = require('../models/ChatUserModel')
require("dotenv/config");





const AllChatUsersMain = async (req, res) => {
    try {
        // Fetch all chat users
        const chatUsers = await ChatUsers.find().populate('patient').populate('doctor');
    
        res.json({
          success: true,
          data: chatUsers
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: 'Failed to fetch chat users',
          error: error.message
        });
      }
};



module.exports = {
    AllChatUsersMain,
  
};
