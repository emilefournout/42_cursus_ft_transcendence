import React from "react";
import "./FriendCard.css";
import { Avatar } from "../../../../../components/Avatar";
import { FriendCardProps } from "./accepted_friend_card/AcceptedFriendCard";

export function PendingFriendCard(props: FriendCardProps) {
  return (
    <div className="friend-card">
      <div className="friend-card-avatar">
        <Avatar
          url={props.userInfo.avatar}
          size="48px"
          upload={false}
          download={true}
        />
      </div>
      <div className="friend-card-username ellipsed-txt">
        {props.userInfo.username}
      </div>
      <div className="friend-card-subtitle">Sent, Waiting For Response</div>
    </div>
  );
}
