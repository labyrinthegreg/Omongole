import './App.css'
import './chat.css'
import VideoChatRoom from './components/VideoChatRoom'
import TextChatRoom from './components/TextChatRoom';
import io, { Socket } from 'socket.io-client';
import { Link } from 'react-router-dom';


function App(props: any) {
  return (
    <div className="App">
      <div className="container-video">
        <VideoChatRoom socket={props.socket}/>
        <div className="icon">
          <Link to={'/'} >
            <div className="stop">
              <img src="../src/assets/arret.svg" alt="" className="stopImage"/>
            </div>
          </Link>
          <div className="next">
            <button onClick={()=>Skipping(props.socket)}><img src="../src/assets/vers-lavant.svg" alt="" className="nextImage"/></button>
              
            </div>
          </div>
      </div>
      <div className="container-chat">
        <TextChatRoom socket={props.socket}/>
      </div>
    </div>
  )
}

function Skipping(socket: Socket) { 
  socket.emit('skipping')
}

export default App
