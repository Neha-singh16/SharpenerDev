const { Op } = require("sequelize");
const sequelize = require("../database/db-connection");
const ArchivedChat = require("../models/archivedChatModej");
const Chat = require("../models/chatModel");
const {transaction}= require("sequelize");

async function archiveChats() {
  let transaction = await sequelize.transaction();
  try {
    const cutoffDate = new Date(Date.now() - 12 * 60 * 60 * 1000);

    const oldChats = await Chat.findAll({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate,
        },
      },
      transaction,
    });

    console.log(`Found ${oldChats.length} old chats`);
    
    if (oldChats.length === 0) {
      await transaction.commit();
      return {
        archivedCount: 0,
      };
    }

    const archivedChats = oldChats.map((chat) => ({
      id: chat.id,
      userId: chat.userId,
      roomId: chat.roomId,
      groupId: chat.groupId,
      message: chat.message,
      mediaUrl: chat.mediaUrl,
      mediaType: chat.mediaType,
      fileName: chat.fileName,
      fileSize: chat.fileSize,
      // Preserve original timestamps
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    //  Insert old chats into ArchivedChats
    await ArchivedChat.bulkCreate(archivedChats, {
      transaction,
    });

    console.log(`${archivedChats.length} chats copied to ArchivedChats`);

    await Chat.destroy({
      where: {
        id: {
          [Op.in]: oldChats.map((chat) => chat.id),
        },
      },
      transaction,
    });
    console.log(`${oldChats.length} chats deleted from Chats`);

    await transaction.commit();

    console.log("Chat archival completed successfully");

    return {
      archived: oldChats.length,
    };

  } catch (err) {
    await transaction.rollback();
    console.error("Chat archival failed:", err);
    throw err;
  }
}

module.exports = {
  archiveChats,
};
