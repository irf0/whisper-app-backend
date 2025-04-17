const express = require('express')
const http = require('http')
const cors = require('cors')
const {Server} = require('socket.io')

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let users = {}; // userId -> socketId

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('login', (userId) => {
    users[userId] = socket.id;
    console.log(`${userId} logged in as ${socket.id}`);
  });

  socket.on('send-msg', ({ fromUserId, toUserId, message }) => {
    const toSocketId = users[toUserId];
    if (toSocketId) {
      io.to(toSocketId).emit('receive-msg', {
        fromUserId,
        message
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    Object.keys(users).forEach(uid => {
      if (users[uid] === socket.id) {
        delete users[uid];
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});