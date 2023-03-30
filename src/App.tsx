import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <div className="container-video">
        <div className="camRandomUser"></div>
        <div className="camUser"></div>
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

export default App
