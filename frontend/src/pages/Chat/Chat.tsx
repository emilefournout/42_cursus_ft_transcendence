import React, { JSX, useState } from "react";
import { NavBar } from "../../components/NavBar/NavBar";
import { LeftBar } from "./ChatLeftBar/ChatLeftBar";
import SEO from "../../components/Seo";
import "./Chat.css";
import { Outlet } from "react-router-dom";

export function ChatPage() {
  return (
    <>
      <SEO
        title="Pong - Chat"
        description="Start a conversation now with a friends or join a channel."
      />

      <div id="chatpage-container">
        <LeftBar />
        <Outlet />
        {/*<Room />*/}
      </div>
    </>
  );
}
