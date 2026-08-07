// app.js
const chatForm = document.getElementById("chatForm");

const messageInput = document.getElementById("messageInput");
const mediaInput = document.getElementById("mediaInput");
const mediaBtn = document.getElementById("mediaBtn");

window.addEventListener("DOMContentLoaded", () => {
  console.log("Chat Application Started");

  loadGroups();
});
mediaBtn.addEventListener("click", () => {
  mediaInput.click();
});
mediaInput.addEventListener("change", uploadMedia);

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

async function uploadMedia() {
  const file = mediaInput.files[0];
  if (!file) {
    return alert("no file selected");
  }
  const formData = new FormData();
  formData.append("file", file);

  const uploadRes = await axios.post(
    "http://localhost:3000/media/upload",

    formData,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  console.log("uplaodRes", uploadRes);

  await axios.post(
    "http://localhost:3000/media/send",

    {
      groupId: selectedGroupId,

      mediaUrl: uploadRes.data.url,

      mediaType: file.type,
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  mediaInput.value = "";
}
