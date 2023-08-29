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
import Chat from "../../../../components/Chat";

export interface RoomNavBarProps {
  chat?: ChatInfo | undefined;
}

export function RoomToolBar(props: RoomNavBarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  if (props.chat === undefined) return <></>;
  else
    return (
      <div className="wrapper-room-bar">
        <span className="ellipsed-txt">
          {props.chat.name ? props.chat.name : "no name"}
        </span>
        {location.pathname.includes("param") ? (
          <img
            className={"nav-icons"}
            src={CloseIcon}
            onClick={() => {
              navigate(`/board/chats/${props.chat!.id}`);
            }}
          ></img>
        ) : (
          <img // This Image should change depending on whether this is a group or a DM
            className="nav-icons"
            src={RoomParamsIcon}
            onClick={() => {
              navigate(`/board/chats/${props.chat!.id}/param`);
            }}
          ></img>
        )}
      </div>
    );
}
