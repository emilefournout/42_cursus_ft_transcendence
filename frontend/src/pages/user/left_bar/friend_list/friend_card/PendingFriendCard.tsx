import React from "react";
import "./FriendCard.css";
import { Avatar } from "../../../../../components/Avatar";
import { FriendCardProps } from "./accepted_friend_card/AcceptedFriendCard";

export function PendingFriendCard(props: FriendCardProps) {
  return (
    <div className="friend-card">
      <Avatar
        url={props.userInfo.avatar}
        size="48px"
        upload={false}
        download={true}
      />

      <div className="friend-card-username ellipsed-txt">
        {props.userInfo.username}
      </div>
      <div className="friend-card-subtitle">Sent, Waiting For Response</div>
    </div>
  );
}
