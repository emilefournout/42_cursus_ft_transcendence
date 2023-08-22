import React, { useState } from "react";
import { FriendStatus, UserStatus } from "../../FriendStatus";
import "../FriendCard.css";
import { Avatar } from "../../../../../../components/Avatar";
import { User } from "../../../../../Board/Board";
import { useNavigate } from "react-router-dom";
import { ProfilePageContext } from "../../../../UserProfilePage";
import { CardAction } from "./CardAction";

export interface FriendCardProps {
  userInfo: User;
}
export function AcceptedFriendCard(props: FriendCardProps) {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="friend-card"
        onClick={() => navigate("/board/userAccount/" + props.userInfo.id)}
      >
        <Avatar url={props.userInfo.avatar} />
        <div>{props.userInfo.username}</div>
        <FriendStatus status={props.userInfo.status} />
      </div>
      <div>
        <CardAction userId={props.userInfo.id} />
      </div>
    </>
  );
}
