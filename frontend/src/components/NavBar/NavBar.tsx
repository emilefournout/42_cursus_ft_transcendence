import React from "react";
import "./NavBar.css"
import settingsIcon from "../../common/config.svg"
import chatsIcon from "../../common/chats.svg"
import userIcon from "../../common/user.svg"

export function NavBar() {
  return (
      <nav>
        <div id="nav-left-side">
          <a className="nav-icons"><img src={settingsIcon}></img></a>
          <a className="nav-icons"><img src={chatsIcon}></img></a>
          <a className="nav-icons"><img src={userIcon}></img></a>
        </div>
        <h2 className="txt txt-shadow-top nav-responsive-text">PONG</h2>
        <button id="nav-right-side" className="btn btn-bottom-left nav-responsive-text">Play</button>
      </nav>
  );
}
