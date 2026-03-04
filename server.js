const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.data.username = username || 'Anonymous';
    socket.broadcast.emit('system-message', `${socket.data.username} joined the chat`);
  });

  socket.on('chat-message', (message) => {
    if (!message || typeof message !== 'string') {
      return;
    }

    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    io.emit('chat-message', {
      username: socket.data.username || 'Anonymous',
      text: trimmed,
      timestamp: Date.now()
    });
  });

  socket.on('disconnect', () => {
    if (socket.data.username) {
      socket.broadcast.emit('system-message', `${socket.data.username} left the chat`);
    }
  });
});

server.listen(PORT, () => {  console.log(`Server running at http://localhost:${PORT}`);
});
