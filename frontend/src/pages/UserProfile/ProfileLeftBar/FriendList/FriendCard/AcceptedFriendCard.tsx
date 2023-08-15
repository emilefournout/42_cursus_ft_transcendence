import React from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import "./FriendCard.css";
import { User } from "../../../UserProfilePage";
import { Avatar } from "../../../../../components/Avatar";

interface AcceptedFriendCardProps {
  userInfo: User;
}
export function AcceptedFriendCard(props: AcceptedFriendCardProps) {
  return (
    <div className="friend-card">
      <Avatar url={props.userInfo.avatar} />
      <div>{props.userInfo.username}</div>
      <FriendStatus status={props.userInfo.status} />
    </div>
  );
}
