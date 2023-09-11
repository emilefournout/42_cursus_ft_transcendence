import React from "react";
import { ChatInfo } from "../../../Chat";

interface RoomSearchCardProps {
  chat: ChatInfo;
  join: (chat: ChatInfo) => void;
  key: number;
}
export function RoomSearchCard(props: RoomSearchCardProps) {
  return (
    <>
      <div key={props.chat.id} className="wrapper-room-search-list">
        <div className="ellipsed-txt">{props.chat.name}</div>
        <button onClick={() => props.join(props.chat)}>Join</button>
      </div>
    </>
  );
}
