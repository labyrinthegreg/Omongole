import './App.css'
import VideoChatRoom from './components/VideoChatRoom'
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
        <div className="chatBubbleReceived"></div>
        <div className="chatBubbleSend"></div>
        <div className='sendInput'>
          <form action="post">
            <input type="text" className="inputMessage"/>
            <input type="image" src="../src/assets/avion-en-papier.svg" className="sendIcon"/>
          </form>
        </div>
      </div>
    </div>
  )
}

function Skipping(socket: Socket) { 
  socket.emit('skipping')
}

export default App
