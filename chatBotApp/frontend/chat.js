const BASE_URL = "http://localhost:3000/chat";
const socket = io("http://localhost:3000");
const token = localStorage.getItem("token");

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatBody = document.getElementById("chatBody");

// Load old messages when page opens
window.addEventListener("DOMContentLoaded", loadMessages);

socket.on("receive-message", (chat) => {
    displayMessage(chat);
});

// Send message
chatForm.addEventListener("submit", sendMessage);

async function sendMessage(e) {
    e.preventDefault();

    const message = messageInput.value.trim();

    if (!message) return;

    try {

        const res = await axios.post(
            `${BASE_URL}/post-message`,
            { message },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Show message instantly
        displayMessage({
            message,
            createdAt: new Date()
        });

        messageInput.value = "";

    } catch (err) {
        console.error(err);
        alert("Unable to send message");
    }
}

async function loadMessages() {

    try {

        const res = await axios.get(
            `${BASE_URL}/read-messages`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        // Clear existing messages
        chatBody.innerHTML = "";

        const chats = res.data.chats;

        chats.forEach(chat => {
            displayMessage(chat);
        });

    } catch (err) {

        console.error(err);

        alert("Unable to load messages");

    }

}

function displayMessage(chat) {

    const time = new Date(chat.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    chatBody.innerHTML += `
        <div class="message sent">
            <div class="bubble">
                ${chat.message}
                <span>${time}</span>
            </div>
        </div>
    `;

    chatBody.scrollTop = chatBody.scrollHeight;
}