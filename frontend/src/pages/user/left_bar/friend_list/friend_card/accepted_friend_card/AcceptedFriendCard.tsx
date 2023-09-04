import React from "react";
import { FriendStatus } from "../../FriendStatus";
import "../FriendCard.css";
import { Avatar } from "../../../../../../components/Avatar";
import { User } from "../../../../../board/Board";
import { useNavigate } from "react-router-dom";
import { CardAction } from "./CardAction";

export interface FriendCardProps {
  userInfo: User;
}

export function AcceptedFriendCard(props: FriendCardProps) {
  const navigate = useNavigate();
  return (
    <>
      <div className="friend-card">
        <div
          className="friend-card-avatar"
          onClick={() => navigate("/board/user-account/" + props.userInfo.id)}
        >
          <Avatar
            url={props.userInfo.avatar}
            size="48px"
            upload={false}
            download={true}
          />
        </div>
        <div
          className="friend-card-username ellipsed-txt"
          onClick={() => navigate("/board/user-account/" + props.userInfo.id)}
        >
          {props.userInfo.username}
        </div>
        <FriendStatus status={props.userInfo.status} />
        <CardAction userId={props.userInfo.id} />
      </div>
    </>
  );
}
