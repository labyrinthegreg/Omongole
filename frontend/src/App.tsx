import { useState } from 'react'
import './App.css'
import styled from 'styled-components';
import VideoChatRoom from './components/VideoChatRoom'
import TextChatRoom from './components/TextChatRoom';
import io from'socket.io-client'

function App() {
  const socket = io(import.meta.env.VITE_BACK_URL)
  return (
    <div className="App">
      <div className="container-video">
        <VideoChatRoom/>
        <div className="icon">
            <div className="stop">
              <img src="../src/assets/arret.svg" alt="" className="stopImage"/>
            </div>
            <div className="next">
              <img src="../src/assets/vers-lavant.svg" alt="" className="nextImage"/>
            </div>
          </div>
      </div>
      <div className="container-chat">
        <TextChatRoom socket={socket}/>
      </div>
    </div>
  )
}

export default App
