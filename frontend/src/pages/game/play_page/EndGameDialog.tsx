import React from "react";
import "../../root/Dialog.css";
import { useNavigate } from "react-router-dom";

interface DialogProps {
  dialog: string | undefined;
  setDialog: (dialog: string | undefined) => void;
}

export function EngGameDialog(props: DialogProps) {
  const navigate = useNavigate();
  const closeDialog = () => props.setDialog(undefined);
  return (
    <>
      {props.dialog ? (
        <dialog className="dialog-window wrapper-col" open={!!props.dialog}>
          {props.dialog}
          <button
            onClick={() => {
              closeDialog();
              navigate("/board/game");
            }}
          >
            home
          </button>
        </dialog>
      ) : (
        <></>
      )}
    </>
  );
}
