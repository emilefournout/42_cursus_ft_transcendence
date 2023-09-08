import React from "react";
import { User } from "../../../../../board/Board";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../../Room";
import { devlog } from "../../../../../../services/core";

interface BannedMemberCardProps {
  user: User;
}
export function BannedMemberCard(props: BannedMemberCardProps) {
  const roomContextArgs = useOutletContext<RoomContextArgs>();

  const navigate = useNavigate();
  const unban = async () =>
    fetch(
      `${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}/ban`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: props.user.id,
        }),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Error unbanning");
        roomContextArgs.getChatInfo(roomContextArgs.chat);
      })
      .catch((error) => {
        devlog(error);
      });
  return (
    <>
      <div
        title={props.user.username}
        style={{ backgroundColor: "red" }}
        className="room-param-user-name ellipsed-txt"
        onClick={() => navigate(`/board/user-account/${props.user.id}`)}
      >
        {props.user.username}
      </div>
      <button onClick={unban}>Unban</button>
    </>
  );
}
