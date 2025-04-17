const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("User B connected:", socket.id);
  socket.emit("login", "userB");
});


socket.on("receive-msg", (data) => {
  console.log("User B received message:", data);
});
