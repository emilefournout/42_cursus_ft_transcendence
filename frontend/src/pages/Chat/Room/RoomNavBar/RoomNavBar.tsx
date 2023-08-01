import React from "react";
import "./RoomNavBar.css"
import DMParamsIcon from "./DMParamsIcon.svg"
import RoomParamsIcon from "./RoomParamsIcon.svg"

export function RoomNavBar() {
  return (
    <div className="wrapper-row wrapper-room-bar">
      <span>Room Name</span>
      <img
        className="nav-icons"
        src={RoomParamsIcon}
      ></img>
    </div>
  );
}
