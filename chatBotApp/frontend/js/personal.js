const BASE_URL = "http://localhost:3000/chat";

let selectedEmail = null;
let roomId = "";

// Search button
document.getElementById("searchBtn").addEventListener("click", searchUser);

/* ================================
   Search User
================================ */

async function searchUser() {
  try {
    const email = document.getElementById("emailInput").value.trim();

    if (!email) {
      return alert("Enter email");
    }

    const res = await axios.get(
      `${BASE_URL}/search?email=${email}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    showUser(res.data.user);
  } catch (err) {
    alert(err.response?.data?.error || "User not found");
  }
}

/* ================================
   Show User
================================ */

function showUser(user) {
  const conversationList = document.getElementById("conversationList");

  conversationList.innerHTML += `

        <div class="user"

            onclick='openChat("${user.email}","${user.username}")'>

            <h4>👤 ${user.username}</h4>

            <p>${user.email}</p>

        </div>

    `;
}

/* ================================
   Create Personal Room
================================ */

function createRoom(email1, email2) {
  return [email1, email2]

    .sort()

    .join("_");
}

/* ================================
   Open Chat
================================ */

function openChat(email, username) {

  selectedGroupId = null;

    selectedEmail = email;

  roomId = createRoom(
    currentUserEmail,

    email,
  );

  updateChatHeader(
    username,

    "Personal Chat",
  );

  socket.emit(
    "join-room",

    roomId,
  );

  loadRoomMessages(roomId);
}

/* ================================
   Load Messages
================================ */

async function loadRoomMessages(roomId) {
  try {
    const res = await axios.get(
      `${BASE_URL}/messages/${roomId}`,

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

/* ================================
   Send Message
================================ */

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
  } catch (err) {
    console.log(err);
  }
}
