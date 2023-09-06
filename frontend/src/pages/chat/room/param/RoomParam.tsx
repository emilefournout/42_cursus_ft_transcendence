import React, { useContext, useState } from "react";
import "./RoomParam.css";
import { useNavigate, useOutletContext } from "react-router-dom";
import { AddUser } from "./chat_members/AddUser";
import { ChatMembers } from "./chat_members/ChatMembers";
import { RoomContextArgs } from "../Room";
import { UpdateVisibilityButtons } from "./UpdateVisibilityButtons";
import { BoardContext } from "../../../board/Board";
import { MuteDialog } from "./dialogs/MuteDialog";
import { UpdateVisibilityDialog } from "./dialogs/UpdateVisibilityDialog";
import { testing } from "../../../../services/core";
import { ChatPageContext } from "../../Chat";

interface MuteDialogContextArgs {
  mute: (value: number | undefined) => void;
}

export const MuteDialogContext = React.createContext(
  {} as MuteDialogContextArgs
);

export function RoomParam() {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const chatPageContext = useContext(ChatPageContext);
  const boardContext = useContext(BoardContext);
  const me = roomContextArgs.chat.members?.find(
    (member) => member.userId === boardContext?.me.id
  );
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const isOwner: boolean | undefined = me?.owner === true;
  const isAdmin: boolean | undefined = me?.administrator === true;
  const isManager = isOwner || isAdmin;
  const [userIdToMute, setUserIdToMute] = useState<number | undefined>(
    undefined
  );
  const navigate = useNavigate();
  const leaveRoom = () => {
    if (me === undefined) return;

    fetch(
      `${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}/user`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: me.userId }),
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Error leaving room");
        chatPageContext
          .updateChat()
          .then(() => {
            navigate("/board/chats");
          })
          .catch((error) => {});
      })
      .catch((error) => {
        if (testing) console.log(error);
      });
  };

  if (isAdmin === undefined || isOwner === undefined || me === undefined)
    return <></>;
  return (
    <>
      <MuteDialog
        userIdToMute={userIdToMute}
        setUserIdToMute={setUserIdToMute}
      />
      <UpdateVisibilityDialog
        showUpdateDialog={showUpdateDialog}
        setShowUpdateDialog={setShowUpdateDialog}
      />
      <button onClick={leaveRoom}>Leave room</button>
      <div className="room-param">
        {isManager ? <AddUser /> : <>Members:</>}
        {isOwner && (
          <UpdateVisibilityButtons updateVisibility={setShowUpdateDialog} />
        )}
        <MuteDialogContext.Provider
          value={{ mute: setUserIdToMute } as MuteDialogContextArgs}
        >
          <ChatMembers isManager={isManager} />
        </MuteDialogContext.Provider>
      </div>
    </>
  );
}
