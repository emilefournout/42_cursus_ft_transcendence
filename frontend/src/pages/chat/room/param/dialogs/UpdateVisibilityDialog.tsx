import React, { useContext } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";
import { Visibility } from "../../add/create/RoomCreate";
import { ChatPageContext } from "../../../Chat";
import { DialogContext } from "../../../../root/Root";

interface UpdateVisibilityDialogProps {
  showUpdateDialog: boolean;
  setShowUpdateDialog: (open: boolean) => void;
}
export function UpdateVisibilityDialog(props: UpdateVisibilityDialogProps) {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const chatPageContext = useContext(ChatPageContext);
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const navigate = useNavigate();
  const close = () => {
    props.setShowUpdateDialog(false);
  };

  const updateVisibility = (visibility: Visibility) => {
    if (visibility === roomContextArgs.chat.visibility) {
      close();
      setDialog("visibility is already set to " + visibility);
      return;
    }
    if (visibility === Visibility.PROTECTED) {
      close();
      navigate("change-password");
      return;
    }
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatVisibility: Visibility.PUBLIC }),
    })
      .then((response) => {
        if (response.ok) {
          //roomContextArgs.getChatInfo(roomContextArgs.chat);
          chatPageContext.updateChat().catch((error) => {
            console.log(error);
          });
          close();
          setDialog("visibility updated to " + Visibility.PUBLIC);
        }
      })
      .catch((error) => {
        close();
        console.log(error);
      });
  };

  return (
    <div>
      <dialog open={props.showUpdateDialog}>
        Update visibility :
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          <button onClick={() => updateVisibility(Visibility.PUBLIC)}>
            Public
          </button>
          <button onClick={() => updateVisibility(Visibility.PROTECTED)}>
            Protected
          </button>
        </div>
        <button onClick={close}>cancel</button>
      </dialog>
    </div>
  );
}