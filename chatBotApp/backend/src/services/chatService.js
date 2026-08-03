const Chat = require("../models/chatModel");

async function postMessage(userId , message){
    const chat = await Chat.create({userId, message});
    return chat;
}


async function getAllMessages(){
const chats = await Chat.findAll({include: "User"});
const formattedChats = chats.map((chat => {
return {
    message: chat.message,
    createdAt: chat.createdAt
}

}

))
  return formattedChats;
}
module.exports = {postMessage, getAllMessages};