

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

async function postMessage({
  userId,
  roomId = null,
  groupId = null,
  message = null,
  mediaUrl = null,
  mediaType = null,
  fileName = null,
  fileSize = null,
}) {
  const newChat = await Chat.create({
    userId,
    roomId,
    groupId,
    message,
    mediaUrl,
    mediaType,
    fileName,
    fileSize,
  });

  const chat = await Chat.findByPk(newChat.id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
  });

  return {
    id: chat.id,
    userId: chat.user.id,
    username: chat.user.username,
    roomId: chat.roomId,
    groupId: chat.groupId,
    message: chat.message,
    mediaUrl: chat.mediaUrl,
    mediaType: chat.mediaType,
    fileName: chat.fileName,
    fileSize: chat.fileSize,
    createdAt: chat.createdAt,
  };
}


async function getAllMessages() {
  const chats = await Chat.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username", "email"],
      },
    ],

    order: [["createdAt", "ASC"]],
  });

  return chats.map((chat) => ({
    id: chat.id,
    userId: chat.user.id,
    username: chat.user.username,
    roomId: chat.roomId,
    groupId: chat.groupId,
    message: chat.message,
    mediaUrl: chat.mediaUrl,
    mediaType: chat.mediaType,
    fileName: chat.fileName,
    fileSize: chat.fileSize,
    createdAt: chat.createdAt,
  }));
}

// ==========================================
// GET PERSONAL CHAT MESSAGES
// ==========================================

async function getRoomMessages(roomId) {
  const chats = await Chat.findAll({
    where: {
      roomId,
    },

    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    ],

    order: [["createdAt", "ASC"]],
  });

  return chats.map((chat) => ({
    id: chat.id,
    userId: chat.user.id,
    username: chat.user.username,
    email: chat.user.email,
    roomId: chat.roomId,
    message: chat.message,
    mediaUrl: chat.mediaUrl,
    mediaType: chat.mediaType,
    fileName: chat.fileName,
    fileSize: chat.fileSize,
    createdAt: chat.createdAt,
  }));
}


async function searchEmail(email) {
   console.log("EMAIL RECEIVED BY SERVICE:", email);
    console.log("EMAIL JSON:", JSON.stringify(email));
  return await User.findOne({
    where: {
      email,
    },
  });
}

module.exports = {
  postMessage,
  getAllMessages,
  getRoomMessages,
  searchEmail,
};
