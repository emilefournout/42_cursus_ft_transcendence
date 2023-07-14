import React from "react";
import Chat from "../../components/Chat";
import settingsIcon from "../../common/config.svg"
import chatsIcon from "../../common/chats.svg"
import userIcon from "../../common/user.svg"

export function ChatPage() {
  return (
    <>
      <nav>
        <div id="nav-left-side">
          <a className="nav-icons"><object data={settingsIcon}></object></a>
          <a className="nav-icons"><object data={chatsIcon}></object></a>
          <a className="nav-icons"><object data={userIcon}></object></a>
        </div>
        <div className=""><h2 className="txt txt-shadow-top">PONG</h2></div>
        <button id="nav-right-side" className="btn btn-bottom-left">Play</button>
      </nav>
    </>
    // <Chat />
  );
}
