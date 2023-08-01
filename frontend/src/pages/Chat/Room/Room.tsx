import React from "react";
import { RoomNavBar } from "./RoomNavBar/RoomNavBar";
import { Messages } from "./Messages/Messages";
import { RoomInput } from "./RoomInput/RoomInput";
import "./Room.css"

export function Room() {
  return (
    <div className="wrapper-col wrapper-room">
      <RoomNavBar />
      <Messages />
      <RoomInput />
    </div>
  );
}
