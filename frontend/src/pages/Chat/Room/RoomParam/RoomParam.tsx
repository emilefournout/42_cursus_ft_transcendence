import React from "react";
import "./RoomParam.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AddUser } from "./ChatMembers/AddUser";
import { ChatMembers } from "./ChatMembers/ChatMembers";
import { ChatInfo } from "../../Chat";
import { RoomContextArgs } from "../Room";
import { Visibility } from "../RoomCreate/RoomCreate";
export function RoomParam() {
  const navigate = useNavigate();
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  if (roomContextArgs.chat === undefined) return <></>;
  else
    return (
      <div className="room-param">
        <div style={{ padding: "10px" }}>
          {roomContextArgs.chat.visibility === Visibility.PROTECTED && (
            <button onClick={() => navigate("changePassword")}>
              change password
            </button>
          )}
        </div>
        <div style={{ padding: "10px" }}>
          <button onClick={() => navigate("delete")}>delete room</button>
        </div>
        <div style={{ padding: "10px" }}>
          <AddUser />
          <ChatMembers />
        </div>
      </div>
    );
}
