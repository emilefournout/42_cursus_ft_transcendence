import React, { useState } from "react";
import { ChatInfo } from "../../../Chat";
import { devlog, testing } from "../../../../../services/core";

interface PasswordDialogProps {
  showDialog: ChatInfo | undefined;
  setShowDialog: (dialog: ChatInfo | undefined) => void;
  fetchJoin: (chat: ChatInfo, password?: string) => Promise<void>;
}

export function PasswordDialog(props: PasswordDialogProps) {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const closeDialog = () => props.setShowDialog(undefined);
  const join = (password: string) => {
    if (password.length === 0) {
      setErrorMessage("Please enter a password");
      return;
    }
    props.fetchJoin(props.showDialog!, password).catch((error) => {
      devlog(error);
      setErrorMessage("Incorrect password");
    });
  };

  return (
    <>
      <dialog open={!!props.showDialog}>
        {props.showDialog?.name} is protected, please enter password:
        <input
          value={password}
          type="password"
          placeholder="new password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          <button onClick={closeDialog}>Close</button>
          <button onClick={() => join(password)}>Join</button>
        </div>
        {errorMessage}
      </dialog>
    </>
  );
}
