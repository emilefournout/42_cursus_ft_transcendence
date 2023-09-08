import React, { useContext } from "react";
import { Visibility } from "../add/create/RoomCreate";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../Room";
import { ChatPageContext } from "../../Chat";
import { DialogContext } from "../../../root/Root";

interface UpdateVisibilityButtonsProps {
  updateVisibility: (open: boolean) => void;
}
export function UpdateVisibilityButtons(props: UpdateVisibilityButtonsProps) {
  const navigate = useNavigate();
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const chatPageContext = useContext(ChatPageContext);

  if (roomContextArgs.chat === undefined) {
    return <></>;
  } else {
    return (
      <>
        <button onClick={() => props.updateVisibility(true)}>Update Vis</button>
        {roomContextArgs.chat.visibility === Visibility.PROTECTED && (
          <button
            id="change-pss-btn"
            onClick={() => navigate("change-password")}
          >
            Change Passwd
          </button>
        )}
        <button id="delete-btn" onClick={() => navigate("delete")}>
          Delete Room
        </button>
      </>
    );
  }
}
