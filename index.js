const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

// In-memory storage
let roomMessages = {}; // { roomCode: [ { from, message, time }, ... ] }

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  // Join a secret-code based room
  socket.on('join-room', (roomCode) => {
    if (!roomCode) return;

    socket.join(roomCode);
    console.log(`${socket.id} joined room: ${roomCode}`);

    if (!roomMessages[roomCode]) {
      roomMessages[roomCode] = [];
    }

    // Send chat history to the new client
    socket.emit('chat-history', roomMessages[roomCode]);
  });

  // Handle sending a message in a room
  socket.on('send-msg', ({ roomCode, message }) => {
    if (!roomCode || !message) return;

    const msgObj = {
      from: socket.id,
      message,
      time: Date.now()
    };

    // Store message
    roomMessages[roomCode] = roomMessages[roomCode] || [];
    roomMessages[roomCode].push(msgObj);

    // Optional: limit message history to 100
    if (roomMessages[roomCode].length > 100) {
      roomMessages[roomCode].shift();
    }

    // Broadcast to others
    socket.to(roomCode).emit('receive-msg', msgObj);
  });

  // Panic button to wipe chats
  socket.on('panic', (roomCode) => {
    if (roomMessages[roomCode]) {
      delete roomMessages[roomCode];
      io.to(roomCode).emit('panic-msg');
      console.log(`⚠️ PANIC: Cleared messages in room ${roomCode}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('🚀 Server is running on port 3000');
});
