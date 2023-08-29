import React from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { ChatInfo } from "../../Chat";

export function ChatMembers() {
  const { id } = useParams();
  const chat: ChatInfo = useOutletContext();
  return <>{chat.members && chat.members.map((member) => member.userId)}</>;
}
