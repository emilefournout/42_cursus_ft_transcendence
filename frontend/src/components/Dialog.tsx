import React from "react";

interface DialogProps {
  dialog: string | undefined;
  setDialog: (dialog: string | undefined) => void;
}
export function Dialog(props: DialogProps) {
  return (
    <dialog open={!!props.dialog}>
      {props.dialog}
      <div>
        <button onClick={() => props.setDialog(undefined)}>close</button>
      </div>
    </dialog>
  );
}
