import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'peerjs';

export interface objectMessage {
    userId: string,
    messageTime: string,
    messageContent: string
};

function TextChatRoom(props: any) {
  const [messagesInConv, setMessagesInConv] = useState<objectMessage[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const socket = props.socket;

  const peer = new Peer()

  peer.on('open', () => {
    setUserId(socket.id);
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
    <div className="messageContainer">
        {messagesInConv.map((message, index) => {
            if(message.userId === userId){
                return (
                    <div>
                        <div key={index} className="messageSend">
                            <p className="chatBubbleSend" key={index}>
                            {message.messageContent}
                            </p>
                            <p className='messageTime'>{message.messageTime}</p>
                        </div>
                    </div>
                )
            } else {
                return (
                    <div key={index} className="messageReceived">
                        <p className="chatBubbleReceived" key={index}>
                        {message.messageContent}
                        </p>
                        <p className='messageTime'>{message.messageTime}</p>
                    </div>
                )
            }
        })}
        <form className='sendInput' action='#'>
            <input className="inputMessage"
                type="text"
                autoComplete='off'
                value={messageToSend}
                onChange={(event) => setMessageToSend(event.target.value)}/>
            <button onClick={sendMessage} className="sendIcon">ENVOYER</button>
        </form>
    </div>
  );
}; 

export default TextChatRoom;
