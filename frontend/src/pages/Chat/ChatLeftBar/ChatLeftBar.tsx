import React, { JSX } from "react";
import "./ChatLeftBar.css";
import NewChatIcon from "./NewChatIcon.svg";
import { Room } from "../Room/Room";
import { RoomCreate } from "../Room/RoomCreate/RoomCreate";

export interface ChatLeftBarProps {
  callback: (board: JSX.Element) => void;
}

export function LeftBar(props: ChatLeftBarProps) {
  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <img
          className="nav-icons"
          src={NewChatIcon}
          onClick={() => props.callback(<RoomCreate />)}
        ></img>
      </div>
      <div id="lb-bot-wrapper" onClick={() => props.callback(<Room />)}></div>
    </div>
  );
}
