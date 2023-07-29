import React, { useState } from "react";
import { VisibilityButton } from "./VisibilityButton";
import validator from "validator";
export enum Visibility {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
}

enum passwordStrength {
  EMPTY = "Choose a password",
  WEAK = "Is Not Strong Password: : 8 characters, 1 lowercase, 1 uppercase, 1 number, 1 symbol",
  STRONG = "",
}
export function RoomCreate() {
  const [selected, setSelected] = useState<Visibility>(Visibility.PUBLIC);
  const [passwordSecurity, setPasswordSecurity] = useState(
    passwordStrength.EMPTY
  );
  const [errorMessage, setErrorMessage] = useState(
    passwordStrength.EMPTY.toString()
  );
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
    if (selected === Visibility.PROTECTED) {
      if (passwordSecurity !== passwordStrength.STRONG) {
        setErrorMessage(passwordSecurity.toString());
      } else if (password !== confirm) {
        setErrorMessage("Passwords do not match");
      } else {
        setErrorMessage(passwordStrength.STRONG.toString());
        console.log("create room");
        // TODO: create room
      }
    } else {
      console.log("create room");
    }
  };
  const clearState = () => {
    setPasswordSecurity(passwordStrength.EMPTY);
    setErrorMessage(passwordStrength.EMPTY.toString());
    setPassword("");
    setConfirm("");
  };

  return (
    <>
      <h1>Create a new room</h1>
      <VisibilityButton
        type={Visibility.PUBLIC}
        selected={selected}
        typeCallback={setSelected}
        clearCallback={clearState}
      />
      <VisibilityButton
        type={Visibility.PROTECTED}
        selected={selected}
        typeCallback={setSelected}
        clearCallback={clearState}
      />
      <VisibilityButton
        type={Visibility.PRIVATE}
        selected={selected}
        typeCallback={setSelected}
        clearCallback={clearState}
      />
      {selected === Visibility.PROTECTED && (
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
        </>
      )}

      <button onClick={() => validateConfirm()}>create room</button>
    </>
  );
}
