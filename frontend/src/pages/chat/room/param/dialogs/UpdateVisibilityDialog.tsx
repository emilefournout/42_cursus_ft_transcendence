import React from "react";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";
import { Visibility } from "../../add/create/RoomCreate";

interface UpdateVisibilityDialogProps {
  showUpdateDialog: boolean;
  setShowUpdateDialog: (open: boolean) => void;
}
export function UpdateVisibilityDialog(props: UpdateVisibilityDialogProps) {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const updateVisibility = (visibility: Visibility) => {};
  const close = () => {
    props.setShowUpdateDialog(false);
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
