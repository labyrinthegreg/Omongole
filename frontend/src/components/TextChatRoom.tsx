import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';
import '../TextChatRoom.css'

const socket = io('http://localhost:3000');

export interface objectMessage {
    userId: string,
    messageTime: string,
    messageContent: string
};

function TextChatRoom() {
  const [messagesInConv, setMessagesInConv] = useState<objectMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const peer = new Peer()

  peer.on('open', () => {
    setUserId(socket.id);
    socket.emit('join-room', socket.id);
  })

  useEffect(() => {
    socket.on('message', (messageToSend) => {
    setMessagesInConv(messagesInConv => {
        return [...messagesInConv, messageToSend]
    });
    
    });
    return () => {socket.off('message')};
  }, [messageToSend]);

  const sendMessage = () => {
    if (messageToSend !== '') {
      const currentDate = new Date();
      const messageTime = (currentDate.getHours()<10?'0':'') + currentDate.getHours() + ":" + (currentDate.getMinutes()<10?'0':'') + currentDate.getMinutes();
      socket.emit('message', {userId: userId, messageTime: messageTime, messageContent: messageToSend});
      setMessageToSend('');
    }
  };

  return (
    <div id="body">
        
        {messagesInConv.map((message, index) => {
            if(message.userId === userId){
                return (
                    <div key={index}>
                        <p className="myMessage" key={index}>
                        {message.messageContent}
                        </p>
                        <p className='messageTime'>{message.messageTime}</p>
                    </div>
                )
            } else {
                return (
                    <div key={index}>
                        <p className="otherMessage" key={index}>
                        {message.messageContent}
                        </p>
                        <p className='messageTime'>{message.messageTime}</p>
                    </div>
                )
            }
        })}
        <div id="form">
            <input id="input"
            type="text"
            autoComplete='off'
            value={messageToSend}
            onChange={(event) => setMessageToSend(event.target.value)}/>
            <button onClick={sendMessage}>Send</button>
        </div>
    </div>
  );
}; 

export default TextChatRoom;
