const BASE_URL = "http://localhost:3000/chat";

let selectedEmail = null;
let roomId = "";

// ======================================================
// SEARCH BUTTON
// ======================================================

document.getElementById("searchBtn").addEventListener("click", searchUser);


async function loadConversations() {

    try {

        const res = await axios.get(
            `${BASE_URL}/conversations`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        conversations =
            res.data.conversations;

        renderConversationList();

    } catch (err) {

        console.error(
            "Failed to load conversations:",
            err
        );

    }
}
function addConversation(user) {
  const exists = conversations.some(
    (conversation) => conversation.userId === user.id,
  );

  if (exists) {
    return;
  }

  conversations.push({
    userId: user.id,
    username: user.username,
    email: user.email,
  });

  renderConversationList();
}

// ======================================================
// SEARCH USER
// ======================================================

async function searchUser() {
  try {
    const email = document.getElementById("emailInput").value.trim();

    if (!email) {
      return alert("Enter email");
    }

    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        email,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = res.data.user;

    addConversation(user);

    document.getElementById("emailInput").value = "";
  } catch (err) {
    console.error(err);

    alert(err.response?.data?.error || "User not found");
  }
}
// ======================================================
// SHOW SEARCH RESULT
// ======================================================

function showUser(user) {
  const conversationList = document.getElementById("conversationList");

  const div = document.createElement("div");

  div.className = "user";

  div.innerHTML = `

        <h4>
            👤 ${user.username}
        </h4>

        <p>
            ${user.email}
        </p>

    `;

  div.addEventListener("click", () => {
    openChat(user.email, user.username);
  });

  conversationList.appendChild(div);
}

// ======================================================
// CREATE PERSONAL ROOM
// ======================================================

function createRoom(email1, email2) {
  return [email1, email2].sort().join("_");
}

// ======================================================
// OPEN PERSONAL CHAT
// ======================================================

function openChat(email, username) {
  selectedGroupId = null;

  resetAIState();

  selectedEmail = email;

  roomId = createRoom(currentUserEmail, email);

  updateChatHeader(username, "Personal Chat");

  socket.emit("join-room", roomId);

  loadRoomMessages(roomId);
}

// ======================================================
// LOAD PERSONAL CHAT MESSAGES
// ======================================================

async function loadRoomMessages(roomId) {
  try {
    const res = await axios.get(`${BASE_URL}/messages/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    clearChat();

    clearSmartReplies();

    const chats = res.data.chats;

    chats.forEach(displayMessage);

    // Latest incoming message
    const latestMessage = chats[chats.length - 1];

    if (
      latestMessage &&
      latestMessage.userId !== currentUserId &&
      latestMessage.message &&
      !latestMessage.mediaUrl
    ) {
      await generateSmartReplies(latestMessage.message);
    }
  } catch (err) {
    console.log("Load room messages error:", err);
  }
}

// ======================================================
// SEND PERSONAL MESSAGE
// ======================================================

async function sendPersonalMessage(message) {
  try {
    await axios.post(
      `${BASE_URL}/post-message`,

      {
        roomId,
        message,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    // Refresh sidebar so the conversation
    // is definitely present after first message
    await loadConversations();
  } catch (err) {
    console.log("Send personal message error:", err);
  }
}
