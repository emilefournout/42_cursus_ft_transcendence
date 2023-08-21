import React from "react";
import { RoomToolBar } from "./RoomToolBar/RoomToolBar";
import "./Room.css";
import {
  Navigate,
  Outlet,
  useLocation,
  useOutletContext,
} from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import NoMsgsImg from "../ChatLeftBar/NoMsgs.png";

export function Room() {
  const location = useLocation();
  const [chats]: [Array<ChatInfo>] = useOutletContext();
  if (location.pathname === "/board/chats" && chats.length === 0) {
    return <img src={NoMsgsImg}></img>;
  } else if (location.pathname === "/board/chats") {
    return <Navigate to={`/board/chats/${chats[0].id}`} />;
  } else
    return (
      <div className="wrapper-col wrapper-room">
        <RoomToolBar />
        <Outlet />
      </div>
    );
}
