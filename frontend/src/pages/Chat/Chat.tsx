import SEO from "../../components/Seo";
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
        <LeftBar chats={chats} updateChats={updateChats} />
        <Outlet context={[chats, setChats]} />
        {/*<Room />*/}
      </div>
    </>
  );
}
