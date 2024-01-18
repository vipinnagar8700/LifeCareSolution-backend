const mongoose = require('mongoose');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');
const {Doctor} = require('../models/userModel')
const {Patient} = require('../models/userModel')
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "durzgbfjf",
  api_key: "512412315723482",
  api_secret: "e3kLlh_vO5XhMBCMoIjkbZHjazo",
});


const sendMessages = asyncHandler(async (req, res) => {
  const { senderId, receiverId, content } = req.body;
  let imageUrl; // to store the Cloudinary image URL

  const file = req.file;

  if (file) {
      try {
          const result = await cloudinary.uploader.upload(file.path, {
              folder: 'Chat', // Specify your Cloudinary folder
              resource_type: 'auto',
          });
          imageUrl = result.secure_url;
      } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          return res.status(500).json({
              message: 'Internal Server Error',
              success: false,
          });
      }
  }

  // Validate input data
  if (!senderId || !receiverId ) {
    return res.status(400).json({ message: 'Invalid input data', success: false });
  }

  try {
    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (chat) {
      chat.messages.push({ senderId, receiverId, content , image: imageUrl,});
      await chat.save();

      const length = chat.messages.length;
      return res.status(200).json({
        message: 'Message sent successfully!',
        success: true,
        data: chat,
        length,
      });
    } else {
      const newChat = await Chat.create({
        participants: [senderId, receiverId],
        messages: [{ senderId, receiverId, content ,image: imageUrl, }],
      });

      return res.status(201).json({
        message: 'New chat created successfully!',
        success: true,
        data: newChat,
        length: 1,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  try {
    const userChats = await Chat.find({ participants: userId }).populate({
      path: 'messages.senderId',
      model: 'User', // Adjust this based on your 'User' model name
    }).populate({
      path: 'messages.receiverId',
      model: 'User', // Adjust this based on your 'User' model name
    });

    // Extract sender and receiver roles
    const senderRole = userChats[0].messages[0].senderId.role;
    const senderID = userChats[0].messages[0].senderId._id;
    const receiverRole = userChats[0].messages[0].receiverId.role;
    const receiverID = userChats[0].messages[0].receiverId._id;
console.log(senderRole,receiverRole,"senderRole,receiverRole")
    let senderData, receiverData;

    // Fetch data based on sender's role
    if (senderRole === 'doctor') {
      senderData = await Doctor.find({ user_id: senderID}).exec();
      console.log(senderData,"senderData")
    } else if (senderRole === 'patient') {
      senderData = await Patient.find({ user_id: senderID }).exec();
    }
    // Fetch data based on receiver's role
    if (receiverRole === 'doctor') {
      receiverData = await Doctor.find({ user_id: receiverID }).exec();
    } else if (receiverRole === 'patient') {
      receiverData = await Patient.find({ user_id: receiverID }).exec();
    }

    return res.status(200).json({
      message: 'User chats retrieved successfully!',
      success: true,
      data: {
        userChats,
        senderData,
        receiverData,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
});



const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  try {
    await Chat.findByIdAndRemove(chatId);

    return res.status(200).json({
      message: 'Chat deleted successfully!',
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
});

module.exports = {
  sendMessages,
  getMessages,
  deleteChat,
};
