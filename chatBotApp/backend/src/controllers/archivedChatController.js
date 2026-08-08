const archivedChatService = require("../services/archivedChatService");

async function archiveChats(req, res) {
    try{

        const result = await archivedChatService.archiveChats();
        res.status(200).json(result);
    }catch(err){
        console.error("Error archiving chats:", err);
        res.status(500).json({
            error: err.message
        });
    }
} 

module.exports = {
    archiveChats
}