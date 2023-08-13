import React, { useEffect, useState } from "react";
import { RoomToolBar } from "./RoomToolBar/RoomToolBar";
import { Messages, Msg } from "./Messages/Messages";
import { RoomInput } from "./RoomInput/RoomInput";
import "./Room.css";
import { Outlet, useLocation, useParams } from "react-router-dom";

export function Room() {
  return (
    <div className="wrapper-col wrapper-room">
      <RoomToolBar />
      <Outlet />
    </div>
  );
}
