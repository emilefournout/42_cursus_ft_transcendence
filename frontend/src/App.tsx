import React from 'react';
import { useState } from 'react';
import { socket } from './services/socket'
import './App.css';

function App() {
  const [message, setMessage] = useState("")

  function sendMessage() {
    if (message !== "") {
      socket.emit("send_message", message)
    }
  }

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value)
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
