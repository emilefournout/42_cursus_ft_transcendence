import React from "react";
import { Msg } from "./Messages";

interface MessageProps {
  message: Msg;
  isMyMessage: string;
  key: string;
}

export function Message(props: MessageProps) {
  const date = new Date(props.message.createdAt).toLocaleString();
  return (
    <div className={props.isMyMessage}>
      {date + " | "}
      {props.message.text}
    </div>
  );
}
