import React from "react";
import "./RoomInput.css"
import SendIcon from "./SendIcon.svg"

export function RoomInput() {
  return (
    <div className="wrapper-room-input">
      <input></input>
      <div><img 
        className="nav-icons"
        src={SendIcon}
      ></img></div>
    </div>
  );
}
