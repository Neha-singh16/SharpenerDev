// media.js

const MEDIA_BASE_URL = "http://localhost:3000/media";
const mediaBtn = document.getElementById("mediaBtn");
const mediaInput = document.getElementById("mediaInput");

mediaBtn.addEventListener("click", () => {
  // Media sharing currently supports groups
  if (!selectedGroupId) {
    return alert("Select a group before sending media");
  }

  mediaInput.click();
});

// FILE SELECTED
mediaInput.addEventListener("change", handleFileSelected);

async function handleFileSelected() {
  const file = mediaInput.files[0];

  if (!file) {
    return;
  }

  console.log("Selected file:", file);

  try {
    await sendMedia(file);
  } catch (err) {
    console.error("Media error:", err);
  }
}

// UPLOAD FILE TO S3

async function uploadMedia(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${MEDIA_BASE_URL}/upload`,

    formData,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

// SEND MEDIA MESSAGE
async function sendMedia(file) {
  if (!selectedGroupId) {
    return alert("Select a group first");
  }

  try {
  
    // STEP 1
    // Upload actual file to S3
    const uploadData = await uploadMedia(file);

    console.log("S3 upload response:", uploadData);
    // STEP 2
    // Save chat message
    const response = await axios.post(
      `${MEDIA_BASE_URL}/send`,

      {
        groupId: selectedGroupId,

        mediaUrl: uploadData.mediaUrl,

        mediaType: uploadData.mediaType,

        fileName: uploadData.fileName,

        fileSize: uploadData.fileSize,
      },

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("Media message saved:", response.data);
    // ***********************************
    // IMPORTANT
    // DON'T call displayMessage()
    // here.
    //
    // Socket.IO will deliver it.
    mediaInput.value = "";
  } catch (err) {
    console.error("Failed to send media:", err);

    alert(err.response?.data?.error || "Failed to send media");

    mediaInput.value = "";
  }
}
