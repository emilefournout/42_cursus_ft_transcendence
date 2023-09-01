import React from "react";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";

interface DeleteDialogProps {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
}
export function DeleteDialog(props: DeleteDialogProps) {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const deleteRoom = () => {};
  const close = () => {
    props.setShowDeleteDialog(false);
  };

  return (
    <div>
      <dialog open={props.showDeleteDialog}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          Are you sure ?<button onClick={close}>cancel</button>
          <button onClick={deleteRoom}>delete room</button>
        </div>
      </dialog>
    </div>
  );
}
