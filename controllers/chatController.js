const { generateToken } = require('../config/JwtToken');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt = require('jsonwebtoken');
require('dotenv/config')





const AddUserforChat = asyncHandler(async (req, res) => {
  const { participants } = req.body;

  const newChat = await Chat.create({ participants });

  res.status(201).json({
    message: 'Chat created successfully!',
    success: true,
    data: newChat,
  });
});

// Get all unique participants
const AllParticipants = asyncHandler(async (req, res) => {
  const uniqueParticipants = await Chat.aggregate([
    { $unwind: '$participants' }, // Unwind the participants array
    { $group: { _id: null, participants: { $addToSet: '$participants' } } }, // Group and create an array of unique participants
  ]);

  if (uniqueParticipants.length > 0) {
    res.status(200).json({
      message: 'All participants retrieved successfully!',
      success: true,
      data: uniqueParticipants[0].participants,
    });
  } else {
    res.status(404).json({
      message: 'No participants found!',
      success: false,
    });
  }
});

// Get all chats for a user
const GetAllChat = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const userChats = await Chat.find({ participants: userId })
    .populate('participants', 'username') // Populate the 'participants' field with 'username'
    .exec();
const length = userChats.length;
  res.status(200).json({
    message: 'User chats retrieved successfully!',
    success: true,
    data: userChats,
    length
  });
});


const sendMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { senderId, receiverId, content } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: {
        messages: {
          senderId,
          receiverId,
          content,
        },
      },
    },
    { new: true }
  );

  const length = updatedChat.length;
  res.status(200).json({
    message: 'Message sent successfully!',
    success: true,
    // data: updatedChat,
    // length
  });
});





module.exports = {
  AddUserforChat,sendMessages,GetAllChat,AllParticipants
}