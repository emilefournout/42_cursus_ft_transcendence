import React from "react";
import "./RoomNavBar.css";
import DMParamsIcon from "./DMParamsIcon.svg";
import RoomParamsIcon from "./RoomParamsIcon.svg";
import { useNavigate, useParams } from "react-router-dom";

export function RoomNavBar() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="wrapper-row wrapper-room-bar">
      <span>Room Name</span>
      <img // This Image should change depending on whether this is a group or a DM
        className="nav-icons"
        src={RoomParamsIcon}
        onClick={() => {
          navigate(`/chats/${id}/param`);
        }}
      ></img>
    </div>
  );
}
