function displayMessage(chat) {
  let content = "";

  // TEXT MESSAGE
  if (!chat.mediaUrl) {
    content = chat.message || "";
  }

  // IMAGE
  else if (chat.mediaType && chat.mediaType.startsWith("image/")) {
    content = `
            <img
                src="${chat.mediaUrl}"
                class="chat-image"
                alt="${chat.fileName || "Shared image"}"
            />
        `;
  }

  // VIDEO
  else if (chat.mediaType && chat.mediaType.startsWith("video/")) {
    content = `
            <video
                controls
                class="chat-video"
            >
                <source
                    src="${chat.mediaUrl}"
                    type="${chat.mediaType}"
                />

                Your browser does not support
                this video.
            </video>
        `;
  }


  // AUDIO
  else if (chat.mediaType && chat.mediaType.startsWith("audio/")) {
    content = `
            <audio controls>
                <source
                    src="${chat.mediaUrl}"
                    type="${chat.mediaType}"
                />

                Your browser does not support
                this audio.
            </audio>
        `;
  }

 
  // PDF / DOCX / ZIP / ETC.
  else {
    content = `
            <a
                href="${chat.mediaUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                📎 ${chat.fileName || "Open / Download File"}
            </a>
        `;
  }


  // MESSAGE TYPE
  const messageType = chat.userId === currentUserId ? "sent" : "received";

  
  // USERNAME
 const username =
    messageType === "received" ? `<strong>${chat.username}</strong><br>` : "";


  // TIME
  const time = new Date(chat.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });


  // ADD TO CHAT
    const chatBody = document.getElementById("chatBody");

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
