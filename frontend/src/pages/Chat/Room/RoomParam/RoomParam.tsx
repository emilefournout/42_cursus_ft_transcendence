import React from "react";
import "./RoomParam.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AddUser } from "./AddUser";
import { ChatMembers } from "./ChatMembers";
export function RoomParam() {
  const navigate = useNavigate();
  const chat = useOutletContext();
  if (chat === undefined) return <>undefined {}</>;
  else
    return (
      <div className="room-param">
        <div style={{ padding: "10px" }}>
          <button onClick={() => navigate("changePassword")}>
            change password
          </button>
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
