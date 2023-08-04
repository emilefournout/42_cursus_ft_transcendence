import React, { JSX, useEffect, useState } from "react";
import "./ChatLeftBar.css";
import NewChatIcon from "./NewChatIcon.svg";
import { Link } from "react-router-dom";
import { Visibility } from "../Room/RoomCreate/RoomCreate";

interface Chat {
  id: number;
  name: string;
  visibility: Visibility;
}
export function LeftBar() {
  const [chats, setChats] = useState([]);
  useEffect(() => {
    return () => {
      fetch("http://localhost:3000/chat/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setChats(data);
        });
    };
  }, []);

  return (
    <div id="lb-main-wrapper" className="wrapper-col">
      <div id="lb-top-wrapper">
        <span>Chats</span>
        <Link to="/chats/create">
          <img className="nav-icons" src={NewChatIcon} />
        </Link>
      </div>
      {/* <Link to="/chats/room">*/}
      <div id="lb-bot-wrapper">
        {chats.map((chat: Chat) => {
          return <div>{chat.id}</div>;
        })}
      </div>
      {/*</Link>*/}
    </div>
  );
}
