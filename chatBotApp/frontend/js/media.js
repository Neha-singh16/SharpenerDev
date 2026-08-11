

// media.js

const MEDIA_BASE_URL = "http://localhost:3000/media";

const mediaBtn = document.getElementById("mediaBtn");
const mediaInput = document.getElementById("mediaInput");


// ========================================
// CLICK ATTACHMENT BUTTON
// ========================================

mediaBtn.addEventListener("click", () => {
    if (!selectedGroupId && !selectedEmail) {
        return alert("Select a user or group before sending media");
    }

    mediaInput.click();
});



mediaInput.addEventListener(
    "change",
    handleFileSelected
);


async function handleFileSelected() {

    const file = mediaInput.files[0];

    if (!file) {
        return;
    }

    console.log("Selected file:", file);

    try {

        await sendMedia(file);

    } catch (err) {

        console.error(
            "Media error:",
            err
        );
    }
}



async function uploadMedia(file) {

    const formData = new FormData();

    formData.append(
        "file",
        file
    );


    const response = await axios.post(

        `${MEDIA_BASE_URL}/upload`,

        formData,

        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }

    );


    return response.data;
}


// ========================================
// STEP 2
// SAVE MEDIA MESSAGE
// PERSONAL + GROUP
// ========================================

async function sendMedia(file) {

    if (!selectedGroupId && !selectedEmail) {

        alert(
            "Select a user or group before sending media"
        );

        mediaInput.value = "";

        return;
    }


    try {

        const uploadData =
            await uploadMedia(file);


        console.log(
            "S3 upload response:",
            uploadData
        );

        const mediaData = {

            mediaUrl: uploadData.mediaUrl,

            mediaType: uploadData.mediaType,

            fileName: uploadData.fileName,

            fileSize: uploadData.fileSize,

        };


        if (selectedEmail) {

            console.log(
                "Sending media to personal chat:",
                roomId
            );


            mediaData.roomId = roomId;

            mediaData.groupId = null;

        }


        // ========================================
        // GROUP CHAT
        // ========================================

        else if (selectedGroupId) {

            console.log(
                "Sending media to group:",
                selectedGroupId
            );


            mediaData.groupId =
                selectedGroupId;

            mediaData.roomId = null;

        }


        const response = await axios.post(

            `${MEDIA_BASE_URL}/send`,

            mediaData,

            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }

        );


        console.log(
            "Media message saved:",
            response.data
        );


        // DON'T CALL displayMessage()
        // Socket.IO will send the message to
        // all users in the conversation.
        //
        // Personal:
        // receive-message
        //
        // Group:
        // receive-group-message
   


        mediaInput.value = "";


    } catch (err) {

        console.error(
            "Failed to send media:",
            err.response?.data || err
        );


        alert(
            err.response?.data?.error ||
            "Failed to send media"
        );


        mediaInput.value = "";
    }
}