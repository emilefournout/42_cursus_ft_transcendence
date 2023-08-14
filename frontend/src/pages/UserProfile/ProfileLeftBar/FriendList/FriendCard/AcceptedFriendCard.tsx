import React, { useEffect, useState } from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import "./FriendCard.css";
import { User } from "../../../UserProfilePage";

interface AcceptedFriendCardProps {
  userInfo: User;
}
export function AcceptedFriendCard(props: AcceptedFriendCardProps) {
  return (
    <div className="friend-card">
      {/*Avatar*/}
      <div>{props.userInfo.username}</div>
      <div>Accepted</div>
      <FriendStatus status={UserStatus.Offline} />
    </div>
  );
}
