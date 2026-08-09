
// window.token = localStorage.getItem("token");

// const token = window.token;

// const payload = JSON.parse(atob(token.split(".")[1]));

// const currentUserId = payload.userId;
// const currentUserEmail = payload.email;

// const socket = io("http://localhost:3000", {
//   auth: {
//     token,
//   },
// });

// window.socket = socket;
// window.currentUserId = currentUserId;
// window.currentUserEmail = currentUserEmail;

// socket.on("receive-message", (chat) => {
//    console.log(chat);
//     displayMessage(chat);

//        // Don't generate replies for my own message
//       if (
//         chat.userId !== currentUserId &&
//         chat.message &&
//         !chat.mediaUrl
//     ) {

//         await generateSmartReplies(
//             chat.message
//         );
//     }

// });

// socket.on("receive-group-message", (chat) => {
//    console.log("receive-group-message", chat);
//     displayMessage(chat);


//     // Don't generate replies for my own message
  
//       if (
//         chat.userId !== currentUserId &&
//         chat.message &&
//         !chat.mediaUrl
//     ) {

//         await generateSmartReplies(
//             chat.message
//         );
//     }

// });


window.token = localStorage.getItem("token");

const token = window.token;

if (!token) {
    console.error("No authentication token found");
}

const payload = JSON.parse(
    atob(token.split(".")[1])
);

const currentUserId = payload.userId;
const currentUserEmail = payload.email;



const socket = io("http://localhost:3000", {
    auth: {
        token
    }
});


// Make available to other JS files
window.socket = socket;
window.currentUserId = currentUserId;
window.currentUserEmail = currentUserEmail;


socket.on("receive-message", async (chat) => {

    console.log("receive-message:", chat);

    displayMessage(chat);

    // Generate smart replies only
    // for someone else's TEXT message
    if (
        chat.userId !== currentUserId &&
        chat.message &&
        !chat.mediaUrl
    ) {

        await generateSmartReplies(
            chat.message
        );
    }

});



socket.on("receive-group-message", async (chat) => {

    console.log(
        "receive-group-message:",
        chat
    );

    displayMessage(chat);

    // Generate smart replies only
    // for someone else's TEXT message
    if (
        chat.userId !== currentUserId &&
        chat.message &&
        !chat.mediaUrl
    ) {

        await generateSmartReplies(
            chat.message
        );
    }

});




