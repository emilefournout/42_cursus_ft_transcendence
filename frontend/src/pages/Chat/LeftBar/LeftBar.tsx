import React from "react";
import { NewConv } from "./NewConversation/NewConv";
import { Conversations } from "./Conversations/Conversations";

export function LeftBar() {
  return (
    <>
      <h1>leftbar</h1>
      <NewConv />
      <Conversations />
    </>
  );
}
