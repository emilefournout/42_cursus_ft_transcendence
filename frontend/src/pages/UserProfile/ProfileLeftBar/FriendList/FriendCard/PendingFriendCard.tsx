import React from "react";
import "./FriendCard.css";
import { Avatar } from "../../../../../components/Avatar";
import { FriendCardProps } from "./AcceptedFriendCard";

export function PendingFriendCard(props: FriendCardProps) {
  return (
    <div className="friend-card">
      <Avatar url={props.userInfo.avatar} />

      <div>{props.userInfo.username}</div>
      <div>sent, waiting for response</div>
    </div>
  );
}
