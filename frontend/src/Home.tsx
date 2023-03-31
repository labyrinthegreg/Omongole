import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Link } from 'react-router-dom'

function Home() {


    const [value, setValue] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter") {
            if (value !== "") {
                setTags(tags => [value])
                setValue("")
            } else {
                setTags([value])
            }
        }
    }



    return (
        <div className="App">
            <div className="container_blur">
                <div className="omongole">
                    <h1>
                        OMONGOLE
                    </h1>
                </div>
                <div className="container_tag">
                    <div className="container_tags">
                        <p className="title">
                            YOUR TAG
                        </p>
                        <p>
                            {tags.map(tag => {return(<span className="tags">{tag}</span>)})}
                        </p>
                        <button className="button_reset_container" onClick={() => setTags(tags => [])}>
                            <p className="button_reset"> RESET TAG</p>
                        </button>
                    </div>
                    <div className="separator"></div>
                    <div className="container_enter_tag">
                        <p className="title">
                            ENTER A TAG
                        </p>
                        <input type="text" id="myTag" name="myTag" onKeyPress={handleKeyPress} onChange={e => setValue(e.target.value)} value={value}/>
                    </div>
                </div>
                <div className="container_button">
                    <Link to={'/chatvideo'} >
                        <button className="button_container">
                        <p className="button_text">CHAT VIDEO</p>
                    </button>
                    </Link>
                    <Link to={'/chatonly'}>
                        <button className="button_container">
                        <p className="button_text">CHAT ONLY</p>
                    </button>
                    </Link>
                    
                </div>
            </div>
        </div>
    )
}

export default Home