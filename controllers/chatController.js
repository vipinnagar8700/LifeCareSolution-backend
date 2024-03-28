const mongoose = require('mongoose');
const Chat = require('../models/chatModel');
const asyncHandler = require('express-async-handler');
const {Doctor} = require('../models/userModel')
const {Patient} = require('../models/userModel')
const cloudinary = require("cloudinary").v2;
const socketio = require('socket.io');
const http = require('http');
const express = require("express");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
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
      chat.messages.push({ senderId, receiverId, content , image: imageUrl, isRead: false });
      await chat.save();

      const length = chat.messages.length;

      // Emit Socket.IO event to notify clients about new message
      io.emit('newMessage', { chatId: chat._id, message: chat.messages[length - 1] });

      return res.status(200).json({
        message: 'Message sent successfully!',
        success: true,
      });
    } else {
      const newChat = await Chat.create({
        participants: [senderId, receiverId],
        messages: [{ senderId, receiverId, content ,image: imageUrl, isRead: false }],
      });

      // Emit Socket.IO event to notify clients about new chat and message
      io.emit('newChat', newChat);

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

    // Calculate the length of messages for each chat
    const messageLengths = userChats.map(chat => chat.messages.length);

    // Calculate the length of unread messages for each chat
    const unreadMessageLengths = userChats.map(chat => {
      return chat.messages.filter(message => !message.isRead).length;
    });

    // Extract sender and receiver roles
    const senderRole = userChats[0].messages[0].senderId.role;
    const senderID = userChats[0].messages[0].senderId._id;
    const receiverRole = userChats[0].messages[0].receiverId.role;
    const receiverID = userChats[0].messages[0].receiverId._id;

    let senderData, receiverData;

    // Fetch data based on sender's role
    if (senderRole === 'doctor') {
      senderData = await Doctor.find({ user_id: senderID}).exec();
    } else if (senderRole === 'patient') {
      senderData = await Patient.find({ user_id: senderID }).exec();
    }
    // Fetch data based on receiver's roleno
    if (receiverRole === 'doctor') {
      receiverData = await Doctor.find({ user_id: receiverID }).exec();
    } else if (receiverRole === 'patient') {
      receiverData = await Patient.find({ user_id: receiverID }).exec();
    }
    const length = userChats.length;
    return res.status(200).json({
      message: 'User chats retrieved successfully!',
      success: true,
      data: {
        userChats,
        messageLengths, // Adding message lengths to the response
        unreadMessageLengths, // Adding unread message lengths to the response
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error', success: false });
  }
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  const { chatId, messageId } = req.params;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found', success: false });
    }

    const message = chat.messages.id(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found', success: false });
    }

    message.isRead = true;
    await chat.save();

    return res.status(200).json({ message: 'Message marked as read', success: true });
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
  markMessageAsRead
};
