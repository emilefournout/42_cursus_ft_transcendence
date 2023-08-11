import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { useParams } from "react-router-dom";
import "./Messages.css";
import { RoomInput } from "../RoomInput/RoomInput";

export interface MsgProps {
  messages: Array<Msg>;
}
export interface Msg {
  uuid: string;
  text: string;
  userId: number;
  chatId: number;
}
export function Messages() {
  const [messages, setMessages] = useState<Array<Msg>>([]);
  const { id } = useParams();
  useEffect(() => {
    {
      /* fetch(`http://localhost:3000/chat/${id}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });*/
      setMessages([
        { uuid: "1", text: "hello", userId: 1, chatId: 1 },
        { uuid: "2", text: "how are you ?", userId: 2, chatId: 1 },
        { uuid: "3", text: "I am fine and you ?", userId: 1, chatId: 1 },
      ]);
    }
    return () => {};
  }, [id]);
  const myUserId = localStorage.getItem("user_id");
  return (
    <>
      {" "}
      <div className="messages">
        {messages.map((message: Msg) => {
          {
            /*Todo handle no user ID*/
          }
          if (!myUserId) throw new Error("No user id");
          const isMyMessage =
            message.userId === parseInt(myUserId)
              ? "message-right"
              : "message-left";
          return (
            <div className={isMyMessage} key={message.uuid}>
              {message.text}
            </div>
          );
        })}
      </div>
      <RoomInput />
    </>
  );
}
