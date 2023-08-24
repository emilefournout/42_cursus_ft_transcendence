import React from "react";

interface DialogProps {
  dialog: string | undefined;
  setDialog: (dialog: string | undefined) => void;
}
export function Dialog(props: DialogProps) {
  const closeDialog = () => props.setDialog(undefined);
  return (
    <dialog open={!!props.dialog}>
      {props.dialog}
      <div>
        <button onClick={closeDialog}>close</button>
      </div>
    </dialog>
  );
}
