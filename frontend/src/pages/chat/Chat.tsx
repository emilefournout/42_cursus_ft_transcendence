import SEO from "../../components/Seo";
import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Outlet, useNavigate } from "react-router-dom";
import { Visibility } from "./room/add/create/RoomCreate";
import { LeftBar } from "./left_bar/ChatLeftBar";
import { devlog } from "../../services/core";
import { Dialog } from "../root/Dialog";

export interface ChatInfo {
  id: number;
  name?: string;
  visibility: Visibility;
}
interface ChatPageContextArgs {
  updateChats: () => Promise<void>;
  updateLeaver: (message?: string) => Promise<void>;
  chats: ChatInfo[] | undefined;
}

export const ChatPageContext = React.createContext({} as ChatPageContextArgs);
export function ChatPage() {
  const [chats, setChats] = useState<ChatInfo[] | undefined>(undefined);
  const [dialog, setDialog] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const updateLeaver = async (message?: string) =>
    updateChats()
      .then(() => {
        navigate("/board/chats");
      })
      .then(() => {
        if (message) setDialog(message);
      })
      .catch((error) => {});

  const updateChats = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/chat/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) throw new Error("Error getting chats");
    const data = await response.json();
    setChats(data);
  };

  useEffect(() => {
    updateChats().catch((error) => {
      devlog(error);
    });
    return () => {};
  }, []);
  return (
    <>
      <Dialog dialog={dialog} setDialog={setDialog} />
      <SEO
        title="Pong - Chat"
        description="Start a conversation now with a friends or join a channel."
      />
      <div id="chatpage-container">
        <ChatPageContext.Provider
          value={
            {
              updateChats: updateChats,
              chats: chats,
              updateLeaver: updateLeaver,
            } as ChatPageContextArgs
          }
        >
          <LeftBar />
          <Outlet />
        </ChatPageContext.Provider>
        {/*<Room />*/}
      </div>
    </>
  );
}
