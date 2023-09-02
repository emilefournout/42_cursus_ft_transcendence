import React, { useContext, useState } from "react";
import "./RoomParam.css";
import { useOutletContext } from "react-router-dom";
import { AddUser } from "./chat_members/AddUser";
import { ChatMembers } from "./chat_members/ChatMembers";
import { RoomContextArgs } from "../Room";
import { UpdateVisibilityButtons } from "./UpdateVisibilityButtons";
import { BoardContext } from "../../../board/Board";
import { MuteDialog } from "./chat_members/MuteDialog";
import { UpdateVisibilityDialog } from "./dialogs/UpdateVisibilityDialog";

interface MuteDialogContextArgs {
  mute: (value: number | undefined) => void;
}
export const MuteDialogContext = React.createContext(
  {} as MuteDialogContextArgs
);
export function RoomParam() {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const boardContext = useContext(BoardContext);
  const me = roomContextArgs.chat.members?.find(
    (member) => member.userId === boardContext?.me.id
  );
  const [showUpdateDialog, setShowUpdateDialog] = useState<boolean>(false);
  const isOwner: boolean | undefined = me?.owner === true;
  const isAdmin: boolean | undefined = me?.administrator === true;

  const [userIdToMute, setUserIdToMute] = useState<number | undefined>(
    undefined
  );

  if (isAdmin === undefined || isOwner === undefined) return <></>;
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
      <div className="room-param">
        <AddUser />
        {isOwner && (
          <UpdateVisibilityButtons updateVisibility={setShowUpdateDialog} />
        )}
        <MuteDialogContext.Provider
          value={{ mute: setUserIdToMute } as MuteDialogContextArgs}
        >
          <ChatMembers isManager={isOwner || isAdmin} />
        </MuteDialogContext.Provider>
      </div>
    </>
  );
}
