import React, { useEffect, useState } from "react";
import "./RoomToolBar.css";
import RoomParamsIcon from "./RoomParamsIcon.svg";
import CloseIcon from "./CloseIcon.svg";
import {
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { ChatInfo } from "../../Chat";

export interface RoomNavBarProps {
  name?: string;
}
export function RoomToolBar(props: RoomNavBarProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [chats]: [Array<ChatInfo>] = useOutletContext();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (!id) throw new Error("No id");
    let chat: ChatInfo | undefined;
    if (location.state && location.state.chat) chat = location.state.chat;
    else chat = chats.find((chat: ChatInfo) => chat.id === parseInt(id));
    if (!chat) return;
    if (chat.name) setName(chat.name);
    else setName("No name");
  }, [chats, id, location.state]);

  return (
    <div className="wrapper-row wrapper-room-bar">
      <span>{name}</span>
      {location.pathname.includes("param") ? (
        <img
          className={"nav-icons"}
          src={CloseIcon}
          onClick={() => {
            navigate(`/board/chats/${id}`);
          }}
        ></img>
      ) : (
        <img // This Image should change depending on whether this is a group or a DM
          className="nav-icons"
          src={RoomParamsIcon}
          onClick={() => {
            navigate(`/board/chats/${id}/param`);
          }}
        ></img>
      )}
    </div>
  );
}
