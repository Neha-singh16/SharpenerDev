const token = localStorage.getItem("token");

const payload = JSON.parse(atob(token.split(".")[1]));

const currentUserId = payload.userId;
const currentUserEmail = payload.email;

const socket = io("http://localhost:3000", {
  auth: {
    token,
  },
});

window.socket = socket;
window.currentUserId = currentUserId;
window.currentUserEmail = currentUserEmail;

socket.on("receive-message", (chat) => {
   console.log(chat);
    displayMessage(chat);

});

socket.on("receive-group-message", (chat) => {
   console.log("receive-group-message", chat);
    displayMessage(chat);

});

