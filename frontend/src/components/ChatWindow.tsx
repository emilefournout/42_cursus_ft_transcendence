import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

interface IChatWindow {
  socket: Socket;
  username: string;
  room: string;
}

interface IMessage {
  room: string;
  author: string;
  message: string;
  time: string;
}

function getTime(): string {
  const now = new Date(Date.now());
  return `${now.getHours()}:${
    now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()
  }`;
}

function ChatWindow({ socket, username, room }: IChatWindow) {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  function sendMessage() {
    if (message !== "") {
      const data = {
        chatId: room,
        text: message,
      };
      socket.emit("send_message", data);
      setMessage("");
    }
  }

  useEffect(() => {
    socket.off("receive_message");
    socket.on("receive_message", (data: IMessage) => {
      setMessageList((msgs) => [...msgs, data]);
    });
  }, []);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Chat Room {room}</p>
      </div>
      <div className="chat-body">
        {messageList.map((msg: IMessage, idx: number) => {
          return (
            <div
              className="message"
              key={idx}
              id={username === msg.author ? "you" : "other"}
            >
              <div>
                <div className="message-content">
                  <p>{msg.message}</p>
                </div>
                <div className="message-meta">
                  <p id="time">{msg.time}</p>
                  <p id="author">{msg.author}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={lastMessageRef} />
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default ChatWindow;
