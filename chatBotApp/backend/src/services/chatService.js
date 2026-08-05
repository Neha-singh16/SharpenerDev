const Chat = require("../models/chatModel");
const User = require("../models/userModel");



async function postMessage(userId, message) {

    const newChat = await Chat.create({
        userId,
        message
    });

    const chat = await Chat.findByPk(newChat.id, {
        include: [
            {
                model: User,
                  as: "user",
                attributes: ["id", "username"]
            }
        ]
    });

    return chat;
}



async function getAllMessages() {

    const chats = await Chat.findAll({
        include: [
            {
                model: User,
                  as: "user",
                attributes: ["id", "username"]
            }
        ],
        order: [["createdAt", "ASC"]]
    });

    return chats.map(chat => ({
    
    username: chat.user.username,
    userId: chat.user.id,
    message: chat.message,
    createdAt: chat.createdAt

    }));
}
module.exports = {postMessage, getAllMessages};