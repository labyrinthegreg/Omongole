import './App.css'
import VideoChatRoom from './components/VideoChatRoom'
import TextChatRoom from './components/TextChatRoom';
import io, { Socket } from 'socket.io-client';


function App() {
  const socket = io(import.meta.env.VITE_BACK_URL)
  return (
    <div className="App">
      <div className="container-video">
        <VideoChatRoom socket={socket}/>
        <div className="icon">
            <div className="stop">
              <img src="../src/assets/arret.svg" alt="" className="stopImage"/>
            </div>
          <div className="next">
            <button onClick={()=>Skipping(socket)}><img src="../src/assets/vers-lavant.svg" alt="" className="nextImage"/></button>
              
            </div>
          </div>
      </div>
      <div className="container-chat">
        <TextChatRoom socket={socket}/>
      </div>
    </div>
  )
}

function Skipping(socket: Socket) { 
  socket.emit('skipping')
}

export default App
