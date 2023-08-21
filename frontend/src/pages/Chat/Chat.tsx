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
  members: [];
}

interface ChatPageContextArgs {
  updateChat: () => void;
}

export const ChatPageContext = React.createContext({} as ChatPageContextArgs);
export function ChatPage() {
  const [chats, setChats] = useState([]);

  const updateChats = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/chat/me`, {
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
  useEffect(() => {
    updateChats();
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
