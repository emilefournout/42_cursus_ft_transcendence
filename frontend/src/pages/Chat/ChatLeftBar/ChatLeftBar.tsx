import React, { JSX, useEffect, useState } from "react";
import "./ChatLeftBar.css";
import NewChatIcon from "./NewChatIcon.svg";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { Visibility } from "../Room/RoomCreate/RoomCreate";
import { ChatInfo } from "../Chat";

export interface LeftBarProps {
  chats: Array<ChatInfo>;
  setChats: any;
}

export function LeftBar(props: LeftBarProps) {
  const navigate = useNavigate();

  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/chats/create">
          <img className="nav-icons" src={NewChatIcon} />
        </Link>
      </div>
      {/* <Link to="/chats/room">*/}
      <div id="lb-bot-wrapper">
        {props.chats.length === 0 ? (
          <div>You have no chats</div>
        ) : (
          props.chats.map((chat: ChatInfo) => {
            return (
              <div
                key={chat.id}
                onClick={() => {
                  navigate(`/chats/${chat.id}`, { state: { chat: chat } });
                }}
              >
                {chat.name ? chat.name : "No name"}
              </div>
            );
          })
        )}
      </div>
      {/*</Link>*/}
    </div>
  );
}
