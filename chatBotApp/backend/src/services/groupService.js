const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");
const { Op } = require("sequelize");

async function createGroup(groupName, members, currentUserEmail) {
  members.push(currentUserEmail);

  const newGroup = await Group.create({
    groupName,
  });
  await addMembersToGroup(newGroup.id, members);
  return newGroup;
}

async function getGroups(userId) {
  const groups = await Group.findAll({
    include: [
      {
        model: User,

        where: { id: userId },

        through: {
          attributes: [],
        },
      },
    ],
  });

  return groups.map((group) => ({
    groupId: group.id,

    groupName: group.groupName,
  }));
}

async function getGroupMessages(groupId) {
  const chats = await Chat.findAll({
    where: {
      groupId,
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

async function saveGroupMessage(
  userId,
  groupId,
  mediaUrl = null,
  mediaType = null,
  message,
) {
  const newChat = await Chat.create({
    userId,
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

  return {
    userId: chat.user.id,
    username: chat.user.username,
    mediaUrl: chat.mediaUrl,

    mediaType: chat.mediaType,
    message: chat.message,
    createdAt: chat.createdAt,
  };
}

async function addMembersToGroup(groupId, members) {
  const users = await User.findAll({
    where: {
      email: {
        [Op.in]: members,
      },
    },
  });

  console.log(users);
  const groupMembers = users.map((user) => ({
    groupId,

    userId: user.id,
  }));

  await GroupMember.bulkCreate(groupMembers);
  return groupMembers;
}

async function deleteMember(groupId, userId) {
  const groupMember = await GroupMember.findOne({
    where: {
      groupId,
      userId,
    },
  });
  await groupMember.destroy();
  return groupMember;
}

module.exports = {
  createGroup,
  getGroups,
  getGroupMessages,
  saveGroupMessage,
  addMembersToGroup,
  deleteMember,
};
