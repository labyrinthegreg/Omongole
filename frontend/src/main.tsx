import React from 'react'
import './index.css'
import './chat.css'
import Home from './Home'
import App from './App'

import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import TextChatRoom from './components/TextChatRoom';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACK_URL)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  { path: "/chatvideo", element: <App socket={socket} /> },
  { path: "/chatonly", element: <div className='container-only-chat'><TextChatRoom socket={socket} /></div>}
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RouterProvider router={router} />
)
