import React from "react";
import Chat from "../../components/Chat";
import { NavBar } from "../../components/NavBar/NavBar";
import { LeftBar } from "./ChatLeftBar/ChatLeftBar";
import SEO from "../../components/Seo";

export function ChatPage() {
  return (
    <>
      <SEO
          title="Pong - Chat"
          description='Start a conversation now with a friends or join a channel.' />
      <NavBar />
      <LeftBar />
      {/* <Chat /> */}
    </>
  );
}
