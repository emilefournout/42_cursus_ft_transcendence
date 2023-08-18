import React from "react";
import "./RoomParam.css";
export function RoomParam() {
  return (
    <div className="room-param">
      <div style={{ padding: "10px" }}>
        <button>change password</button>
      </div>
      <div style={{ padding: "10px" }}>
        <button>delete room</button>
      </div>
      <div style={{ padding: "10px" }}>Users</div>
    </div>
  );
}
