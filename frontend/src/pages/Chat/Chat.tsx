import SEO from "../../components/Seo";
import React from "react";
import "./Chat.css";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Visibility } from "./Room/RoomCreate/RoomCreate";
import { LeftBar } from "./ChatLeftBar/ChatLeftBar";

export interface ChatInfo {
  id: number;
  name?: string;
  visibility: Visibility;
  password?: string;
  members?: Array<member>;
}

export interface member {
  userId: number;
  chatId: number;
  createdAt: string;
  administrator: boolean;
  owner: boolean;
  muted: boolean;
  mutedExpiringDate: string;
}

interface ChatPageContextArgs {
  updateChat: () => Promise<void>;
}

export const ChatPageContext = React.createContext({} as ChatPageContextArgs);
export function ChatPage() {
  const [chats, setChats] = useState<ChatInfo[] | undefined>(undefined);
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
      console.log(error);
    });
    return () => {};
  }, []);
  return (
    <>
      <SEO
        title="Pong - Chat"
        description="Start a conversation now with a friends or join a channel."
      />

      <div id="chatpage-container">
        <ChatPageContext.Provider value={{ updateChat: updateChats }}>
          <LeftBar chats={chats} />
          <Outlet context={[chats, setChats]} />
        </ChatPageContext.Provider>
        {/*<Room />*/}
      </div>
    </>
  );
}
