const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const GroupMember = require("../models/groupMemberModel");

const { Op } = require("sequelize");


async function createGroup(groupName, members, currentUserEmail) {
  // Add creator to group
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

        where: {
          id: userId,
        },

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
    id: chat.id,
    userId: chat.user.id,
    username: chat.user.username,
    groupId: chat.groupId,
    message: chat.message,
    mediaUrl: chat.mediaUrl,
    mediaType: chat.mediaType,
    fileName: chat.fileName,
    fileSize: chat.fileSize,
    createdAt: chat.createdAt,
  }));
}


async function addMembersToGroup(groupId, members) {
  const users = await User.findAll({
    where: {
      email: {
        [Op.in]: members,
      },
    },
  });

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

  if (!groupMember) {
    throw new Error("Group member not found");
  }

  await groupMember.destroy();

  return groupMember;
}

module.exports = {
  createGroup,
  getGroups,
  getGroupMessages,
  addMembersToGroup,
  deleteMember,
};
