const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let waitingUser = null;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  if (waitingUser) {
    socket.partner = waitingUser;
    waitingUser.partner = socket;

    socket.emit('partner-connected');
    waitingUser.emit('partner-connected');

    waitingUser = null;
  } else {
    waitingUser = socket;
    socket.emit('waiting');
  }

  socket.on('message', (msg) => {
    if (socket.partner) {
      socket.partner.emit('message', msg);
    }
  });
socket.on('typing', () => {
  const partner = users.get(socket)?.partner;
  if (partner) {
    partner.emit('typing');
  }
});

socket.on('stop-typing', () => {
  const partner = users.get(socket)?.partner;
  if (partner) {
    partner.emit('stop-typing');
  }
});

  socket.on('disconnect', () => {
    if (socket.partner) {
      socket.partner.emit('partner-disconnected');
      socket.partner.partner = null;
    } else if (waitingUser === socket) {
      waitingUser = null;
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

