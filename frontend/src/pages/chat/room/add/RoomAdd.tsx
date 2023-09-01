import React from "react";
import { useNavigate } from "react-router-dom";

export function RoomAdd() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "50%",
        width: "100%",
        gap: "30px",
        padding: "16px",
        left: "0px",
      }}
    >
      <button onClick={() => navigate("search")}>
        Join an existing chat room
      </button>
      <div>or</div>
      <button onClick={() => navigate("create")}>Create a new chat room</button>
    </div>
  );
}
