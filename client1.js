const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("User A connected:", socket.id);
  socket.emit("login", "userA");

  // Send message after 2s
  setTimeout(() => {
    socket.emit("send-msg", {
      fromUserId: "userA",
      toUserId: "userB",
      message: "Hey userB! It's userA ✌️"
    });
  }, 2000);
});

socket.on("receive-msg", (data) => {
  console.log("User A received message:", data);
});
