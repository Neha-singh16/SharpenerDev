const Chat = require("../models/chatModel");
const User = require("../models/userModel");

async function postMessage(userId, roomId, groupId,  mediaUrl=null,
    mediaType=null, message) {
  const newChat = await Chat.create({
    userId,
    roomId,
    groupId,
    mediaUrl,
    mediaType,
    message,
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

  return chat;
}

async function getAllMessages() {
  const chats = await Chat.findAll({
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
    username: chat.user.username,
    userId: chat.user.id,
    message: chat.message,
    createdAt: chat.createdAt,
  }));
}

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
    userId: chat.user.id,

    username: chat.user.username,

    message: chat.message,

    createdAt: chat.createdAt,
  }));
}

async function searchEmail(email) {
  const user = await User.findOne({ where: { email } });
  return user;
}

module.exports = { postMessage, getAllMessages, getRoomMessages, searchEmail };
