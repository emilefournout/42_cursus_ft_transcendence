import React, { useEffect, useState } from "react";
import { Message } from "./Message";
import { useParams } from "react-router-dom";
import "./Messages.css";

export interface MsgProps {
  messages: Msg[];
}
export interface Msg {
  uuid: string;
  text: string;
  userId: number;
  chatId: number;
}
export function Messages(props: MsgProps) {
  const myUserId = localStorage.getItem("user_id");
  return (
    <div className="messages">
      {props.messages.map((message: Msg) => {
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
  );
}
