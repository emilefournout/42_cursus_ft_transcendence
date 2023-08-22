import React from "react";
import { RoomToolBar } from "./RoomToolBar/RoomToolBar";
import "./Room.css";
import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import NoMsgsImg from "../ChatLeftBar/NoMsgs.png";

export function Room() {
  const location = useLocation();
  const [chats]: [Array<ChatInfo> | undefined] = useOutletContext();
  const navigate = useNavigate();

  if (chats === undefined) return <></>;
  else if (location.pathname === "/board/chats" && chats.length === 0) {
    return (
      <>
        <div id="chat-no-messages">No messages?</div>
        <img src={NoMsgsImg}></img>
      </>
    );
  } else if (location.pathname === "/board/chats") {
    navigate(`/board/chats/${chats[0].id}`);
    return <></>;
  } else
    return (
      <div className="wrapper-col wrapper-room">
        <RoomToolBar />
        <Outlet />
      </div>
    );
}
