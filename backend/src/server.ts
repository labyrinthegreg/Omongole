const cors = require('cors');
const express = require('express');
const { Server , Socket} = require("socket.io");
const app = express();
const server = require('http').Server(app);

app.use(cors());
const io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('join-room', (userId: string, peerId: string) => { 
    socket.join("lol");
    socket.to("lol").emit('user-connected', userId, peerId);
  })
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
  socket.on('message', (message: string) => {
    io.emit('message', message)
  })
});

server.listen(3000, () => {
  console.log('listening on port:3000');
});
