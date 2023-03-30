import React, { useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';
import io from 'socket.io-client';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;


const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


const socket = io(import.meta.env.VITE_BACK_URL);

function VideoChatRoom() {
  const currentUserVideoRef = useRef<HTMLVideoElement>(null);
  const remoteUserVideoRef = useRef<HTMLVideoElement>(null);

  const peer = new Peer()

  peer.on('open', (id) => {
    socket.emit('join-room', socket.id, id);
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

      socket.on('user-connected', (userId: string, peerId: string) => { 
        console.log("userId: ", userId);
        const call = peer.call(peerId, stream)
        
        call.on('stream', (remoteStream: MediaStream) => {
          connectToNewUser(remoteStream);
        });
      });
    })

  }, []);

  function connectToNewUser(stream: MediaStream) {
    remoteUserVideoRef.current!.srcObject = stream;
}
  
  return (
    <Container>
      <div className="camRandomUser">
        <Video ref={remoteUserVideoRef} autoPlay muted></Video>
      </div>
      <div className="camUser">
        <Video ref={currentUserVideoRef} autoPlay muted></Video>
      </div>
    </Container>
  );
}

export default VideoChatRoom;
