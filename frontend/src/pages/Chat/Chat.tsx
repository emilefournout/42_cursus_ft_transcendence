import { LeftBar } from "./ChatLeftBar/ChatLeftBar";
import SEO from "../../components/Seo";
import "./Chat.css";
import { Outlet, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import Chat from "../../components/Chat";
import { Visibility } from "./Room/RoomCreate/RoomCreate";
export interface ChatInfo {
  id: number;
  name?: string;
  visibility: Visibility;
  password?: string;
  members: [];
}
export function ChatPage() {
  const [chats, setChats] = useState([]);
  useEffect(() => {
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
    return () => {};
  }, [setChats]);
  return (
    <>
      <SEO
        title="Pong - Chat"
        description="Start a conversation now with a friends or join a channel."
      />

      <div id="chatpage-container">
        <LeftBar chats={chats} setChats={setChats} />
        <Outlet context={[chats, setChats]} />
        {/*<Room />*/}
      </div>
    </>
  );
}
