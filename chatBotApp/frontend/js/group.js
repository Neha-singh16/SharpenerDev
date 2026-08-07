const GROUP_BASE_URL = "http://localhost:3000/groups";
// const socket = window.socket;
let selectedGroupId = null;

const groupModal = document.getElementById("groupModal");

/* ===========================
   EVENT LISTENERS
=========================== */

document.getElementById("createGroupBtn").addEventListener("click", () => {
  groupModal.style.display = "flex";
});

document.getElementById("closeModal").addEventListener("click", () => {
  groupModal.style.display = "none";
});

document.getElementById("createGroup").addEventListener("click", createGroup);

/* ===========================
   CREATE GROUP
=========================== */

async function createGroup() {
  const groupName = document.getElementById("groupName").value.trim();

  const members = document
    .getElementById("memberEmails")
    .value.split(",")
    .map((email) => email.trim())
    .filter((email) => email);

  if (!groupName) {
    return alert("Enter group name");
  }

  try {
    await axios.post(
      `${GROUP_BASE_URL}/create-group`,
      {
        groupName,
        members,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    groupModal.style.display = "none";

    document.getElementById("groupName").value = "";

    document.getElementById("memberEmails").value = "";

    loadGroups();
  } catch (err) {
    console.log(err);
  }
}

/* ===========================
   LOAD GROUPS
=========================== */

async function loadGroups() {
  try {
    const res = await axios.get(
      GROUP_BASE_URL,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    showGroups(res.data.groups);
  } catch (err) {
    console.log(err);
  }
}

/* ===========================
   SHOW GROUPS
=========================== */

function showGroups(groups) {
  const conversationList = document.getElementById("conversationList");

  conversationList.innerHTML = "";

  groups.forEach((group) => {
    conversationList.innerHTML += `

            <div class="user"

                onclick='openGroup(${JSON.stringify(group)})'>

                <h4>👥 ${group.groupName}</h4>

                <p>Group Chat</p>

            </div>

        `;
  });
}

/* ===========================
   OPEN GROUP
=========================== */

function openGroup(group) {
  selectedEmail = null;

  selectedGroupId = group.groupId || group.id;

  updateChatHeader(
    group.groupName,

    "Group Chat",
  );

  socket.emit(
    "join-group",

    selectedGroupId,
  );

  loadGroupMessages(selectedGroupId);
}

/* ===========================
   LOAD GROUP MESSAGES
=========================== */

async function loadGroupMessages(groupId) {
  try {
    const res = await axios.get(
      `${GROUP_BASE_URL}/${groupId}/messages`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    clearChat();

    res.data.chats.forEach(displayMessage);
  } catch (err) {
    console.log(err);
  }
}

/* ===========================
   SEND GROUP MESSAGE
=========================== */

function sendGroupMessage(message) {
  if (!selectedGroupId) {
    return alert("Select a group");
  }

  socket.emit(
    "group-message",

    {
      groupId: selectedGroupId,

      message,
    },
  );
}

// socket.on("receive-group-message", (chat) => {
//   displayMessage(chat);
// });
