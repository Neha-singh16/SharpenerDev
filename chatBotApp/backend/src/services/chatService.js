const Chat = require("../models/chatModel");

async function postMessage(userId , message){
    const chat = await Chat.create({userId, message});
    return chat;
}


// async function getMessages(){

// }
module.exports = {postMessage};