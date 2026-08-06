const BASE_URL = "http://localhost:3000/chat";
const searchBtn = document.getElementById("searchBtn");
const emailInput = document.getElementById("emailInput");
const userList = document.getElementById("userList");
const chatUser = document.getElementById("chatUser");

const token = localStorage.getItem("token");

const payload = JSON.parse(atob(token.split(".")[1]));
const currentUserId = payload.userId;
const currentUserEmail = payload.email;
let roomId = "";
let selectedEmail = null;

console.log(currentUserId);

const socket = io("http://localhost:3000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

searchBtn.addEventListener("click", searchUser);
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");

// Load old messages when page opens
window.addEventListener("DOMContentLoaded", () => {
  console.log("Chat Loaded");
});
// roomId = createRoom(currentUserId, selectedUserId);

function createRoom(email1, email2) {
  return [email1, email2].sort().join("_");
}

function openChat(email, username) {
  selectedEmail = email;

  roomId = createRoom(currentUserEmail, email);

  chatUser.innerText = username;

  socket.emit("join-room", roomId);

  loadRoomMessages(roomId);
}

socket.on("receive-message", (object) => {
  displayMessage(object);
});

// Send message
chatForm.addEventListener("submit", sendMessage);

async function sendMessage(e) {
  e.preventDefault();

  if (!selectedEmail) {
    return alert("Select a user first");
  }

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

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

    messageInput.value = "";
  } catch (err) {
    console.log(err);
  }
}

async function searchUser() {
  try {
    const email = emailInput.value.trim();

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

function showUser(user) {
  userList.innerHTML = `

        <div class="user"
            onclick='openChat("${user.email}","${user.username}")'>

            <h4>${user.username}</h4>

            <p>${user.email}</p>

        </div>

    `;
}
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

    chatBody.innerHTML = "";

    res.data.chats.forEach((chat) => {
      displayMessage(chat);
    });
  } catch (err) {
    console.log(err);
  }
}

function displayMessage(chat) {
  const time = new Date(chat.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const messageType = chat.userId === currentUserId ? "sent" : "received";

  const name =
    messageType === "received" ? `<strong>${chat.username}</strong><br>` : "";

  chatBody.innerHTML += `

        <div class="message ${messageType}">

            <div class="bubble">

                ${name}

                ${chat.message}

                <span>${time}</span>

            </div>

        </div>

    `;

  chatBody.scrollTop = chatBody.scrollHeight;
}
