import React from "react";
import "./NavBar.css";
import settingsIcon from "../../common/config.svg";
import chatsIcon from "../../common/chats.svg";
import userIcon from "../../common/user.svg";
import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav>
      <div id="nav-left-side">
        <Link to="/board/settings" className="nav-icons">
          <img src={settingsIcon}></img>
        </Link>
        <Link to="/board/chats" className="nav-icons">
          <img src={chatsIcon}></img>
        </Link>
        <Link to="/board/userAccount" className="nav-icons">
          <img src={userIcon}></img>
        </Link>
      </div>
      <h2 className="txt txt-shadow-top nav-responsive-text">PONG</h2>
      <Link
        to="/board/game"
        id="nav-right-side"
        className="btn btn-bottom-left nav-responsive-text"
      >
        Play
      </Link>
    </nav>
  );
}
