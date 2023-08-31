import React, { useContext } from "react";
import "./RoomParam.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AddUser } from "./ChatMembers/AddUser";
import { ChatMembers } from "./ChatMembers/ChatMembers";
import { ChatInfo } from "../../Chat";
import { RoomContextArgs } from "../Room";
import { Visibility } from "../RoomCreate/RoomCreate";
import { UpdateVisibilityButtons } from "./UpdateVisibilityButtons";
import { BoardContext } from "../../../Board/Board";
export function RoomParam() {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const boardContext = useContext(BoardContext);

  const me = roomContextArgs.chat.members?.find(
    (member) => member.userId === boardContext?.me.id
  );

  const isOwner: boolean | undefined = me?.owner === true;
  const isAdmin: boolean | undefined = me?.administrator === true;

  if (isAdmin === undefined || isOwner === undefined) return <></>;
  return (
    <div className="room-param">
      {isOwner && <UpdateVisibilityButtons />}
      <div style={{ padding: "10px" }}>
        <AddUser />
        <ChatMembers isManager={isOwner || isAdmin} />
      </div>
    </div>
  );
}
