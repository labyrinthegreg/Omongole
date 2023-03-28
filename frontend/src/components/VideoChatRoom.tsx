import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import styled from 'styled-components';
import { stringify } from 'querystring';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VideoContainer = styled.div`
  width: 640px;
  height: 480px;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

const Button = styled.button`
  margin: 0 8px;
  padding: 8px 16px;
  font-size: 16px;
`;

const Input = styled.input`
  margin: 0 8px;
  padding: 8px 16px;
  font-size: 16px;
  flex: 1;
`;
const socket = io('http://localhost:3000');

function VideoChatRoom() {
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const peer = new Peer()

  peer.on('open', () => {
    socket.emit('join-room', socket.id);
  })
  
  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      
      if (currentUserVideoRef.current) {
        currentUserVideoRef.current.srcObject = stream;
      }
      peer.on('call', (call) => {
        call.answer(stream);
        call.on('stream', (remoteStream: MediaStream) => {
          connectToNewUser(remoteStream);
        });
      });

      socket.on('user-connected', (userId: string) => { 
        console.log("userId: ", userId);
        const call = peer.call(peer.id, stream)
        
        call.on('stream', (remoteStream: MediaStream) => {
          connectToNewUser(remoteStream);
        });
      });
    })

  }, []);

  function connectToNewUser(stream: MediaStream) {
    remoteUserVideoRef.current.srcObject = stream;
}
  
  return (
    <Container>
      <h1>Live Video Chat</h1>
      <VideoContainer>
        <Video ref={currentUserVideoRef} autoPlay muted></Video>
      </VideoContainer>
      <VideoContainer>
        <Video ref={remoteUserVideoRef} autoPlay muted></Video>
      </VideoContainer>
    </Container>
  );
}

export default VideoChatRoom;
