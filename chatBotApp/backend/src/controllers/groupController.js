const groupService = require("../services/groupService");

async function createGroup(req, res) {
  try {
    const { groupName, members } = req.body;
    const group = await groupService.createGroup(groupName, members, req.user.email);

    res.status(201).json({ message: "Group created successfully", group });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

// async function getAllGroup(req, res) {
//   try {
//     const groups = await groupService.getGroups(req.user.id);
//     console.log(req.user);
//     res.status(200).json({ message: "Groups fetched successfully", groups });
//   } catch (err) {
//     res.status(500).json({
//       error: err.message,
//     });
//   }
// }
async function getAllGroup(req, res) {
  try {
    console.log("req.user =", req.user);

    const groups = await groupService.getGroups(req.user.id);

    res.status(200).json({
      message: "Groups fetched successfully",
      groups,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
}

async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;

    const chats = await groupService.getGroupMessages(groupId);

    res.status(200).json({
      chats,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
async function addMembersToGroup(req, res) {
  try {
    const { groupId } = req.params;
    const { members } = req.body;
    const groupMembers = await groupService.addMembersToGroup(groupId, members);
    res
      .status(200)
      .json({ message: "Members added successfully", groupMembers });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}
async function deleteMember(req, res) {
  try {
    const { groupId, userId } = req.params;
    const deleteMember = await groupService.deleteMember(groupId, userId);
    res
      .status(200)
      .json({ message: "Member deleted successfully", deleteMember });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
}

module.exports = {
  createGroup,
  getAllGroup,
  getGroupMessages,
  addMembersToGroup,
  deleteMember,
};
