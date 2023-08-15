import React from "react";
import "./FriendCard.css";
import { User } from "../../../UserProfilePage";
import { Avatar } from "../../../../../components/Avatar";
interface PendingFriendCardProps {
  userInfo: User;
}
export function PendingFriendCard(props: PendingFriendCardProps) {
  return (
    <div className="friend-card">
      <Avatar url={props.userInfo.avatar} />

      <div>{props.userInfo.username}</div>
      <div>sent, waiting for response</div>
    </div>
  );
}
