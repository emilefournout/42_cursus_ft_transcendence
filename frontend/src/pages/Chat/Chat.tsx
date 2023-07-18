import React from "react";
import Chat from "../../components/Chat";
import { NavBar } from "../../components/NavBar/NavBar";
import { LeftBar } from "./ChatLeftBar/ChatLeftBar";

export function ChatPage() {
  return (
    <>
      <NavBar />
      <LeftBar />
      {/* <Chat /> */}
    </>
  );
}
