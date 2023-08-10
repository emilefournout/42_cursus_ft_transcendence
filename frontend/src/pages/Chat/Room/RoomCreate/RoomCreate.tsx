import React, { useState } from "react";
import { VisibilityButton } from "./VisibilityButton";
import validator from "validator";
import chat from "../../../../components/Chat";
import "./RoomCreate.css";

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

  const clearState = (): void => {
    setPasswordSecurity(passwordStrength.EMPTY);
    setErrorMessage(passwordStrength.EMPTY.toString());
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
      setErrorMessage(passwordStrength.STRONG.toString());
    } else {
      setPasswordSecurity(passwordStrength.WEAK);
      setErrorMessage(passwordStrength.WEAK.toString());
    }
    setPassword(value);
  };
  const fetchCreateRoom = async (chatVisibility: string): Promise<void> => {
    fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatVisibility: chatVisibility,
        name: "bonjour",
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          clearState();
          setErrorMessage("Room created!");
        } else {
          clearState();
          setErrorMessage("Error while creating room");
        }
        console.log("response ->", response);
      })
      .catch((error) => {
        clearState();
        setErrorMessage("Erreur lors de la requête");
        console.error("Erreur lors de la requête Fetch:" + error.message);
      });
  };
  const validateConfirm = async (): Promise<void> => {
    let chatVisibility: string;
    if (selected === Visibility.PROTECTED) {
      if (passwordSecurity !== passwordStrength.STRONG) {
        setErrorMessage(passwordSecurity.toString());
        return;
      } else if (password !== confirm) {
        setErrorMessage("Passwords do not match");
        return;
      } else {
        setErrorMessage(passwordStrength.STRONG.toString());
        chatVisibility = "PROTECTED";
      }
    } else {
      chatVisibility = "PUBLIC";
    }
    await fetchCreateRoom(chatVisibility);
  };

  return (
    <div className="wrapper-new-room">
      <h2 className="txt-light">Create a new room</h2>
      <h3 className="txt-light mini-title">Visibility:</h3>
      <div className="wrapper-row wrapper-vis-btns">
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
      </div>
      {selected === Visibility.PROTECTED && (
        <>
          <div id="wrapper-new-room-pswrd">
            <input
              value={password}
              type="password"
              placeholder="set password"
              onChange={(e) => validatePassword(e.target.value)}
            />
            <input
              value={confirm}
              type="password"
              placeholder="confirm password"
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>
          <div id="txt-password-strength">{errorMessage}</div>
        </>
      )}
      <button onClick={() => validateConfirm()}>create room</button>
    </div>
  );
}
