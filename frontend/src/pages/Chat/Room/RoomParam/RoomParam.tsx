import React from "react";
import "./RoomParam.css";
import { useNavigate } from "react-router-dom";
export function RoomParam() {
  const navigate = useNavigate();
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
      <div style={{ padding: "10px" }}>Users</div>
    </div>
  );
}
