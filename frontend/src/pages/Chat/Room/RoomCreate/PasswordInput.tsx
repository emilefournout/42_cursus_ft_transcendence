import React, { useState } from "react";
import { Visibility } from "./RoomCreate";
import validator from "validator";

enum passwordStrength {
  EMPTY = "Choose a password",
  WEAK = "Is Not Strong Password: : 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol",
  STRONG = "",
}
export interface PasswordInputProps {
  selected: Visibility;
}
export function PasswordInputRoom(props: PasswordInputProps) {
  const [passwordSecurity, setPasswordSecurity] = useState(
    passwordStrength.EMPTY
  );
  const [errorMessage, setErrorMessage] = useState(passwordSecurity.toString());
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const validatePassword = (value: string) => {
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
      setErrorMessage(passwordStrength.STRONG.toString());
    } else {
      setPasswordSecurity(passwordStrength.WEAK);
      setErrorMessage(passwordStrength.WEAK.toString());
    }
    setPassword(value);
  };
  const validateConfirm = () => {
    if (passwordSecurity !== passwordStrength.STRONG) {
      setErrorMessage(passwordSecurity.toString());
    } else if (password !== confirm) {
      setErrorMessage("Passwords do not match");
    } else {
      setErrorMessage(passwordStrength.STRONG.toString());
      console.log("create room");
      // TODO: create room
    }
  };

  if (props.selected === Visibility.PROTECTED) {
    return (
      <>
        <div>
          <input
            type="password"
            placeholder="set password"
            onChange={(e) => validatePassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="confirm password"
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        {errorMessage}
        <button onClick={() => validateConfirm()}>create room</button>
      </>
    );
  }
  return <></>;
}
