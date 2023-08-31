import React, { useState } from "react";
import validator from "validator";
import { Dialog } from "../../../../components/Dialog";
import chat from "../../../../components/Chat";
import { useLocation, useNavigate } from "react-router-dom";

export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
}

enum passwordStrength {
  EMPTY = "Choose a password",
  WEAK = "Not Strong enough!\nPassword must have: 8 characters minimum, 1 lowercase, 1 uppercase, 1 number and 1 symbol.",
  STRONG = "That's one strong password!",
}
export function ChangePassword() {
  const [passwordSecurity, setPasswordSecurity] = useState(
    passwordStrength.EMPTY
  );
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(
    passwordStrength.EMPTY.toString()
  );
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dialog, setDialog] = useState<string | undefined>(undefined);

  const clearState = (): void => {
    setPasswordSecurity(passwordStrength.EMPTY);
    setPasswordErrorMessage(passwordStrength.EMPTY.toString());
    setPassword("");
    setConfirm("");
  };
  const validatePassword = (value: string): void => {
    if (
      validator.isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      setPasswordSecurity(passwordStrength.STRONG);
      setPasswordErrorMessage(passwordStrength.STRONG.toString());
    } else {
      setPasswordSecurity(passwordStrength.WEAK);
      setPasswordErrorMessage(passwordStrength.WEAK.toString());
    }
    setPassword(value);
  };

  const changePassword = () => {
    console.log("changePassword");
  };

  const validateConfirm = async (): Promise<void> => {
    if (passwordSecurity !== passwordStrength.STRONG) {
      setPasswordErrorMessage(passwordSecurity.toString());
      return;
    } else if (password !== confirm) {
      setPasswordErrorMessage("Passwords do not match");
      return;
    } else {
      setPasswordErrorMessage(passwordStrength.STRONG.toString());
    }
    await changePassword();
  };

  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <Dialog dialog={dialog} setDialog={setDialog} />
      <div id="wrapper-new-room-pswrd">
        <input
          value={password}
          type="password"
          placeholder="new password"
          onChange={(e) => validatePassword(e.target.value)}
        />
        <input
          value={confirm}
          type="password"
          placeholder="confirm password"
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <div id="txt-password-strength">{passwordErrorMessage}</div>
      <button onClick={() => validateConfirm()}>change password</button>
      <button
        onClick={() =>
          navigate(location.pathname.replace("changePassword", ""))
        }
      >
        back
      </button>
    </>
  );
}
