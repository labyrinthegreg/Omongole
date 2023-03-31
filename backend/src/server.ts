import { Socket } from "socket.io";

const cors = require('cors');
const express = require('express');
const { Server} = require("socket.io");
const app = express();
const server = require('http').Server(app);

export interface user {
  userId: string;
  peerId: string;
  roomId: string ;
  chatVideo: boolean;
  tag: string | undefined;
  alone: boolean;
}

let usersConnected: user[] = [];

app.use(cors());
const io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket: Socket) => {
  console.log("user connected");
  socket.on('join-room', (userId: string, peerId: string, chatVideo: boolean, tag: string | undefined) => {
    
    searchRoom(socket, false, {userId, peerId, chatVideo, tag, alone:true, roomId: ""});
  })

  socket.on('skipping', () => { 
    let userSkipping = usersConnected.find(user => user.userId === socket.id);
    try {
      searchRoom(socket, true, userSkipping!);
      socket.leave(userSkipping!.roomId)
    } catch (error) {
      console.log(error);
    }
    console.log("user skipping");
    
    socket.emit('user-skipped');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    usersConnected = usersConnected.filter(user => user.userId !== socket.id);
  })
  socket.on('message', (message: any) => {
    let roomId: string = usersConnected.find(user => user.userId === socket.id)?.roomId!;
    io.to(roomId).emit('message', message);
  })
});

function searchRoom(socket: Socket, isSkipping: boolean, userSkipping: user) {
  let roomId: string = Date.now().toString();
  let randomNumber: number = 0;
  let usersTagged: user[] = [];
  let foundOne: boolean = false;
  let userJoined: user | undefined;
  let userLeavingIndex: number = 0;

  if (isSkipping) {
    let userRoomId: string | undefined = usersConnected.find(user => user.userId === socket.id)?.roomId;
    userLeavingIndex = usersConnected.findIndex(user => user.userId === socket.id)
    let userInRoomIndex = usersConnected.findIndex(user => user.userId !== socket.id && user.roomId === userRoomId);
    usersConnected[userLeavingIndex].alone = true;
    usersConnected[userLeavingIndex].roomId = roomId;
    if (usersConnected[userInRoomIndex] !== undefined) {
      usersConnected[userInRoomIndex].alone = true;
      io.to(userRoomId!).emit('user-disconnected');
    }
  } else if (!usersConnected.find(user => user.userId === userSkipping.userId)) {
    usersConnected.push({ userId: userSkipping.userId, peerId: userSkipping.peerId, roomId: userSkipping.roomId, chatVideo: userSkipping.chatVideo, tag: userSkipping.tag, alone: true });
    userLeavingIndex = usersConnected.findIndex(user => user.userId === socket.id)
  } 
  
  usersConnected.map(user => {
    if (user.tag === userSkipping.tag && user.userId !== userSkipping.userId && user.alone && user.chatVideo == userSkipping.chatVideo) {
        usersTagged.push(user)
      }
    });
    if (usersTagged.length > 0) {
      console.log("tagged and not alone");
    // If there is at least one person with the same tag and that is alone
      randomNumber = Math.floor(Math.random() * usersTagged.length);
      roomId = usersTagged[randomNumber].roomId;
      userJoined = usersTagged[randomNumber];
      
      usersConnected[usersConnected.findIndex(user => user === userJoined)].alone = false;
      foundOne = true;
    } else {
      console.log("tagged but alone");
    // If there is no one with the same tag
      usersTagged = [];
      usersConnected.map(user => {
        if (user.userId !== userSkipping.userId && user.chatVideo == userSkipping.chatVideo && user.roomId && user.alone) {
          usersTagged.push(user)
        }
      });
      if (usersTagged.length > 0) { 
        console.log("not tagged but not alone");
      // If there is at least one person alone
        randomNumber = Math.floor(Math.random() * usersTagged.length);
        roomId = usersTagged[randomNumber].roomId;
        usersConnected[usersConnected.findIndex(user => user.userId === usersTagged[randomNumber].userId)].alone = false;
        foundOne = true;
      }
    }
    usersConnected[userLeavingIndex!].roomId = roomId;
  usersConnected[userLeavingIndex!].alone = !foundOne; 
  if (userJoined) {
    console.log("user joined room: " + roomId + " with " + userJoined?.roomId);
  }
  
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userSkipping.userId, userSkipping.peerId);
}

server.listen(3000, () => {
  console.log('listening on port:3000');
});
