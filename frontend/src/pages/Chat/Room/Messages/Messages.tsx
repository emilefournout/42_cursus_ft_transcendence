import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { useParams } from "react-router-dom";
import "./Messages.css";
import { RoomInput } from "../RoomInput/RoomInput";
import { BoardContext } from "../../../Board/Board";

export interface MsgProps {
  messages: Array<Msg>;
}

export interface Msg {
  uuid: string;
  text: string;
  createdAt: string;
  userId: number;
  chatId: number;
}

export function Messages() {
  const [messages, setMessages] = useState<Array<Msg>>([]);
  const { id } = useParams();
  useEffect(() => {
    fetch(`http://localhost:3000/chat/${id}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });
    // setMessages([
    // 	{ uuid: "1", text: "hello", userId: 1, chatId: 1 },
    // 	{ uuid: "2", text: "how are you ?", userId: 2, chatId: 1 },
    // 	{ uuid: "3", text: "I am fine and you ?", userId: 1, chatId: 1 },
    // ]);

    return () => {};
  }, [id]);
  const boardContext = React.useContext(BoardContext);
  const myUserId = boardContext?.me.id;
  if (boardContext === undefined) return <>loading</>;
  else {
    return (
      <>
        <div className="wrapper-msgs">
          {messages.map((message: Msg) => {
            const isMyMessage =
              message.userId === myUserId
                ? "message message-right"
                : "message message-left";
            return (
              <Message
                message={message}
                isMyMessage={isMyMessage}
                key={message.uuid}
              />
            );
          })}
        </div>
        <RoomInput />
      </>
    );
  }
}
