import React, { useState } from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import "./FriendCard.css";
import { User } from "../../../UserProfilePage";
interface PendingFriendCard {
  userInfo: User;
}
export function PendingFriendCard(props: PendingFriendCard) {
  const [userInfo, setUserInfo] = useState({});
  return (
    <div className="friend-card">
      <div>{props.userInfo.username}</div>
      <FriendStatus status={UserStatus.Offline} />
    </div>
  );
}
