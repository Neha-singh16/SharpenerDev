// ui.js
let content = "";
function displayMessage(chat) {
  const chatBody = document.getElementById("chatBody");

  const time = new Date(chat.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (chat.mediaUrl) {
    if (chat.mediaType.startsWith("image")) {
      content = `
            <img
                src="${chat.mediaUrl}"
                class="chat-image"
            />
        `;
    } else if (chat.mediaType.startsWith("video")) {
      content = `
            <video
                controls
                class="chat-video"
            >
                <source
                    src="${chat.mediaUrl}"
                    type="${chat.mediaType}"
                />
            </video>
        `;
    } else {
      content = `
            <a
                href="${chat.mediaUrl}"
                target="_blank"
            >
                📄 Download File
            </a>
        `;
    }
  } else {
    content = chat.message;
  }
  const messageType = chat.userId === currentUserId ? "sent" : "received";

  const username =
    messageType === "received" ? `<strong>${chat.username}</strong><br>` : "";

chatBody.innerHTML += `

<div class="message ${messageType}">

    <div class="bubble">

        ${username}

        ${content}

        <span>${time}</span>

    </div>

</div>

`;
  chatBody.scrollTop = chatBody.scrollHeight;
}

function clearChat() {
  document.getElementById("chatBody").innerHTML = "";
}

function updateChatHeader(title, subtitle = "") {
  document.getElementById("chatUser").innerText = title;

  const status = document.getElementById("chatStatus");

  if (status) {
    status.innerText = subtitle;
  }
}
