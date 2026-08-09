const BASE_URL = "http://localhost:3000/chat";

let selectedEmail = null;
let roomId = "";

// Search button
document.getElementById("searchBtn").addEventListener("click", searchUser);


function showUser(user) {
  const conversationList = document.getElementById("conversationList");

  conversationList.innerHTML += `
        <div
            class="user"
            onclick='openChat(
                "${user.email}",
                "${user.username}"
            )'
        >

            <h4>👤 ${user.username}</h4>

            <p>${user.email}</p>

        </div>
    `;
}

async function searchUser() {
  try {
    const email = document.getElementById("emailInput").value.trim();

    if (!email) {
      return alert("Enter email");
    }

    console.log("EMAIL BEING SENT:", email);

    const res = await axios.get(`${BASE_URL}/search`, {
      params: {
        email: email,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("SEARCH API RESPONSE:", res.data);

    showUser(res.data.user);
    emailInput.value= "";
  } catch (err) {
    console.log("SEARCH ERROR:", err.response?.data || err);

    alert(err.response?.data?.error || "User not found");
  }
}

async function loadConversations() {
  try {
    const res = await axios.get(`${BASE_URL}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    showUsers(res.data.chats);
  } catch (err) {
    console.log("Failed to load conversations:", err);
  }
}


  //  Create Personal Room
function createRoom(email1, email2) {
  return [email1, email2]

    .sort()

    .join("_");
}


  //  Open Chat
function openChat(email, username) {
  selectedGroupId = null;
  resetAIState();
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
async function loadRoomMessages(roomId) {

    try {

        const res = await axios.get(
            `${BASE_URL}/messages/${roomId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        clearChat();
        clearSmartReplies();

        const chats = res.data.chats;

        chats.forEach(displayMessage);


        // Smart replies for latest incoming message
        const latestMessage = chats[chats.length - 1];

        if (
            latestMessage &&
            latestMessage.userId !== currentUserId &&
            latestMessage.message &&
            !latestMessage.mediaUrl
        ) {

            await generateSmartReplies(
                latestMessage.message
            );
        }

    } catch (err) {

        console.log(err);

    }
}
  //  Send Message
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
