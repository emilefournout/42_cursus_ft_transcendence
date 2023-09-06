import React, { useContext, useEffect, useState } from "react";
import { RoomToolBar } from "./tool_bar/RoomToolBar";
import "./Room.css";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import NoMsgsImg from "../NoMsgs.png";
import { devlog } from "../../../services/core";

export interface ChatFullInfo extends ChatInfo {
  password?: string;
  members?: Array<Member>;
}

export interface Member {
  userId: number;
  createdAt: string;
  username: string;
  administrator: boolean;
  owner: boolean;
  muted: boolean;
  mutedExpiringDate: string;
}

export interface RoomContextArgs {
  chat: ChatFullInfo;
  getChatInfo: (chat: ChatInfo) => void;
}

export function Room() {
  const location = useLocation();
  const chatPageContext = useContext(ChatPageContext);
  const chats: Array<ChatInfo> | undefined = chatPageContext.chats;
  const { id } = useParams();
  const [chat, setChat] = useState<ChatFullInfo | undefined>(undefined);

  const getChatInfo = async (chat: ChatInfo) =>
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${chat.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error getting chat");
        return response.json();
      })
      .then((chat: ChatFullInfo) => setChat(chat));

  useEffect(() => {
    if (chats === undefined || id === undefined) return;
    let chat: ChatInfo | undefined;
    if (location.state && location.state.chat) chat = location.state.chat;
    else chat = chats.find((chat: ChatInfo) => chat.id === parseInt(id));
    if (chat === undefined) return;
    getChatInfo(chat).catch((error) => {
      devlog(error);
    });
  }, [chats, id, location.state]);

  if (chats === undefined) return <></>;
  else if (location.pathname === "/board/chats" && chats.length === 0) {
    return (
      <div id="chat-no-messages">
        <p>No messages?</p>
        <img src={NoMsgsImg} alt="No messages" />
      </div>
    );
  } else if (location.pathname === "/board/chats") {
    return <Navigate to={`/board/chats/${chats[0].id}`} />;
  } else if (chat === undefined) return <>Chat not found</>;
  else
    return (
      <div className="wrapper-col wrapper-room">
        <RoomToolBar chat={chat} />
        <Outlet
          context={{ chat: chat, getChatInfo: getChatInfo } as RoomContextArgs}
        />
      </div>
    );
}
