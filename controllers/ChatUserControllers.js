
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


const AllChatDoctorMain = async (req, res) => {
  const {id} = req.params;
  console.log(id, "id");
  try {
    // Fetch all chat users where the doctor's user_id matches the provided id
    const chatUsers = await ChatUsers.find({doctor: id }).populate('patient').populate('doctor');
    res.json({
      success: true,
      data: chatUsers,
      length:chatUsers.length,
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

const AllChatPatientMain = async (req, res) => {
  const {id} = req.params;
  console.log(id, "id");
  try {
    // Fetch all chat users where the doctor's user_id matches the provided id
    const chatUsers = await ChatUsers.find({patient: id }).populate('patient').populate('doctor');
    res.json({
      success: true,
      data: chatUsers,
      length:chatUsers.length,
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
    AllChatUsersMain,AllChatDoctorMain,AllChatPatientMain
  
};
