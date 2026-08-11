const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const {Op} = require("sequelize");

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

  if (!chat) {
    throw new Error("Chat message was not created");
  }

  if (!chat.user) {
    throw new Error("User association not found for chat message");
  }

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
async function getUserRecentMessages(userId) {
  const chats = await Chat.findAll({
    where: {
      userId,
    },

    attributes: ["message"],

    order: [["createdAt", "DESC"]],

    limit: 15,
  });

  return chats.map((chat) => chat.message).filter((message) => message);
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

async function getConversations(currentUserId) {

    const chats = await Chat.findAll({

        where: {
            // your existing condition
        },

        include: [
            {
                model: User,
                as: "user",
                attributes: [
                    "id",
                    "username",
                    "email"
                ]
            }
        ],

        order: [
            ["createdAt", "DESC"]
        ]

    });

    const users = new Map();

    for (const chat of chats) {

        if (!chat.user) {
            continue;
        }

        // Don't show myself
        if (chat.user.id === currentUserId) {
            continue;
        }

        // First/latest message determines
        // the conversation entry
        if (!users.has(chat.user.id)) {

            users.set(
                chat.user.id,
                {
                    userId: chat.user.id,
                    username: chat.user.username,
                    email: chat.user.email,
                    lastMessage: chat.message,
                    lastMessageAt: chat.createdAt
                }
            );

        }

    }

    return Array.from(users.values());
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
  getUserRecentMessages,
  getConversations,
  getRoomMessages,
  searchEmail,
};
