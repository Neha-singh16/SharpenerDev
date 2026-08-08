// app.js
const chatForm = document.getElementById("chatForm");

window.addEventListener("DOMContentLoaded", () => {
  console.log("Chat Application Started");

  loadGroups();
});

chatForm.addEventListener("submit", sendMessage);
document.getElementById("searchBtn").addEventListener("click", searchUser);

function sendMessage(e) {
  e.preventDefault();

  const message = messageInput.value.trim();

  if (!message) {
    return;
  }

  // Group Selected
  if (selectedGroupId) {
    sendGroupMessage(message);
  }

  // Personal Selected
  else if (selectedEmail) {
    sendPersonalMessage(message);
  } else {
    return alert("Select a user or group");
  }

  messageInput.value = "";
}
