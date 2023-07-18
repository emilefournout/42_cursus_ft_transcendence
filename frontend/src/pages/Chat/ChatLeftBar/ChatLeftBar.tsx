import React from "react";
import "./ChatLeftBar.css"
import NewChatIcon from "./NewChatIcon.svg"

export function LeftBar() {
  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <img className="nav-icons" src={NewChatIcon}></img>
      </div>
      <div id="lb-bot-wrapper">
      </div>
    </div>
  );
}
