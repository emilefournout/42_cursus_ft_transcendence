import React from "react";
import { RoomNavBar } from "./RoomNavBar/RoomNavBar";
import { Messages } from "./Messages/Messages";
import { RoomInput } from "./RoomInput/RoomInput";

export function Room() {
  return (
    <>
      COUCOU
      <RoomNavBar />
      <Messages />
      <RoomInput />
    </>
  );
}
