import React from "react";
import "./NavBar.css"
import settingsIcon from "../../common/config.svg"
import chatsIcon from "../../common/chats.svg"
import userIcon from "../../common/user.svg"
import { Link } from "react-router-dom";

export function NavBar() {
  return (
      <nav>
        <div id="nav-left-side">
          <Link to="/settings" className="nav-icons">
          <img src={settingsIcon}></img>
          </Link>
          <Link to="/chats" className="nav-icons">
          <img src={chatsIcon}></img>
          </Link>
          <Link to="/home" className="nav-icons">
            <img src={userIcon}></img>
          </Link>
        </div>
        <h2 className="txt txt-shadow-top nav-responsive-text">PONG</h2>
        <Link to="/game">
          <button id="nav-right-side" className="btn btn-bottom-left nav-responsive-text">Play</button>
        </Link>
      </nav>
  );
}
