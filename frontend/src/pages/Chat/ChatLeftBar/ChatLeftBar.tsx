import React, { JSX } from "react";
import "./ChatLeftBar.css";
import NewChatIcon from "./NewChatIcon.svg";
import { Link } from "react-router-dom";

export function LeftBar() {
  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/chats/create">
          <img className="nav-icons" src={NewChatIcon} />
        </Link>
      </div>
      {/* <Link to="/chats/room">*/}
      <div id="lb-bot-wrapper"></div>
      {/*</Link>*/}
    </div>
  );
}
