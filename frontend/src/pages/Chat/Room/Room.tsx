import React, { useEffect, useState } from "react";
import { RoomNavBar } from "./RoomNavBar/RoomNavBar";
import { Messages } from "./Messages/Messages";
import { RoomInput } from "./RoomInput/RoomInput";
import "./Room.css";
import { useParams } from "react-router-dom";

export function Room() {
  const [messages, setMessages] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:3000/chat/${id}/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      });
    return () => {};
  }, [id]);
  return (
    <div className="wrapper-col wrapper-room">
      <RoomNavBar />

      <Messages messages={messages} />
      <RoomInput />
    </div>
  );
}
