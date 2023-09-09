import { useState, useContext } from "react";
import ChatWindow from "./ChatWindow";
import "./Chat.css";
import { ChatPageContext } from "../pages/chat/Chat";

function Chat() {
  const [username, setUsername] = useState(""); // TODO get username
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chatContext = useContext(ChatPageContext);
  const chatSocket = chatContext.socket;
  function joinRoom() {
    if (room !== "") {
      chatSocket.emit("join_room", { chatId: Number(room) });
      setShowChat(true);
    }
  }

  return (
    <>
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Enter username</h3>
          <input
            type="text"
            placeholder="Username"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="text"
            placeholder="Room"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button onClick={joinRoom}>Join the room</button>
        </div>
      ) : (
        <ChatWindow socket={chatSocket} username={username} room={room} />
      )}
    </>
  );
}

export default Chat;
