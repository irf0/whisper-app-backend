const io = require("socket.io-client");

const socket = io('https://whisper-app-backend-e1cb.onrender.com'); 

socket.on("connect", () => {
  console.log("Client1 connected");
  socket.emit("login", "user2");
});

socket.on("receive-msg", (data) => {
  console.log("Received message from user1:", data);
});
