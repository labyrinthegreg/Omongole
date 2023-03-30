import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Home() {

  const [value, setValue] = useState("");

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
        const inputValue = (event.target as HTMLInputElement).value;
        setValue(inputValue);
        // Vous pouvez stocker la valeur dans une variable ou faire autre chose avec cette valeur ici
    }
}

  return (
    <div className="App">
      <div className="container">
        <div className="containerContainerTags">
          <h1>OMONGOLE</h1>
          <div className="containerTags">
            <div className="yourTags">
              <h3>YOUR TAGS</h3>
              <p>your tags</p>
            </div>
            <div className="separator"></div>
            <div className="tags">
              <h3>ENTER TAG</h3>
              <form action="post">
                <input type="text" className="inputTag" onKeyPress={handleKeyPress}/>
              </form>
            </div>
          </div>
          <div className="containerButtonChat">
            <div className="chatVideo">
              <button>Chat video</button>
            </div>
            <div className="chat">
              <button>Chat</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
