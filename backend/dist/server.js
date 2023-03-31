"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require('cors');
const express = require('express');
const { Server } = require("socket.io");
const app = express();
const server = require('http').Server(app);
let usersConnected = [];
app.use(cors());
const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
    console.log("user connected");
    socket.on('join-room', (userId, peerId, chatVideo, tag) => {
        searchRoom(socket, false, userId, peerId, chatVideo, tag);
    });
    socket.on('skipping', () => {
        let userSkipping = usersConnected.find(user => user.userId === socket.id);
        socket.leave(userSkipping.roomId);
        console.log("user skipping");
        searchRoom(socket, true, userSkipping.userId, userSkipping.peerId, userSkipping.chatVideo, userSkipping.tag);
        socket.emit('user-skipped');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        usersConnected = usersConnected.filter(user => user.userId !== socket.id);
    });
    socket.on('message', (message) => {
        var _a;
        let roomId = (_a = usersConnected.find(user => user.userId === socket.id)) === null || _a === void 0 ? void 0 : _a.roomId;
        io.to(roomId).emit('message', message);
    });
});
function searchRoom(socket, isSkipping, userId, peerId, chatVideo, tag) {
    var _a;
    let roomId = Date.now().toString();
    let randomNumber = 0;
    let usersTagged = [];
    let foundOne = false;
    let userJoined;
    if (isSkipping) {
        let userRoomId = (_a = usersConnected.find(user => user.userId === socket.id)) === null || _a === void 0 ? void 0 : _a.roomId;
        usersConnected[usersConnected.findIndex(user => user.userId === socket.id)].alone = true;
        usersConnected[usersConnected.findIndex(user => user.userId === socket.id)].roomId = Date.now().toString();
        usersConnected[usersConnected.findIndex(user => user.userId !== socket.id && user.roomId === userRoomId)].alone = true;
    }
    else if (!usersConnected.find(user => user.userId === userId)) {
        usersConnected.push({ userId, peerId, roomId, chatVideo: chatVideo, tag: tag, alone: true });
    }
    usersConnected.map(user => {
        if (user.tag === tag && user.userId !== userId && user.alone && user.chatVideo == chatVideo) {
            usersTagged.push(user);
        }
    });
    if (usersTagged.length > 0) {
        console.log("tagged and not alone");
        // If there is at least one person with the same tag and that is alone
        randomNumber = Math.floor(Math.random() * usersTagged.length);
        roomId = usersTagged[randomNumber].roomId;
        userJoined = usersTagged[randomNumber];
        usersConnected[usersConnected.findIndex(user => user.userId === usersTagged[randomNumber].userId)].alone = false;
        foundOne = true;
    }
    else {
        console.log("tagged but alone");
        // If there is no one with the same tag
        usersTagged = [];
        usersConnected.map(user => { if (user.userId !== userId && user.chatVideo == chatVideo && user.roomId && user.alone)
            usersTagged.push(user); });
        if (usersTagged.length > 0) {
            console.log("not tagged but not alone");
            // If there is at least one person alone
            randomNumber = Math.floor(Math.random() * usersTagged.length);
            roomId = usersTagged[randomNumber].roomId;
            usersConnected[usersConnected.findIndex(user => user.userId === usersTagged[randomNumber].userId)].alone = false;
            foundOne = true;
        }
    }
    let userConnectedIndex = usersConnected.findIndex(user => user.userId === userId);
    usersConnected[userConnectedIndex].roomId = roomId;
    usersConnected[userConnectedIndex].alone = !foundOne;
    console.log("user joined room: " + roomId + " with " + (userJoined === null || userJoined === void 0 ? void 0 : userJoined.roomId));
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId, peerId);
}
server.listen(3000, () => {
    console.log('listening on port:3000');
});
