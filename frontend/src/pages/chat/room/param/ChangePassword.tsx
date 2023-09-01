import React, { useContext, useState } from "react";
import validator from "validator";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../Room";
import { Visibility } from "../add/create/RoomCreate";
import { ChatPageContext } from "../../Chat";
import { DialogContext } from "../../../root/Root";

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
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const navigate = useNavigate();
  const location = useLocation();
  const backroute = location.pathname.replace("change-password", "");
  const chatPageContext = useContext(ChatPageContext);
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;

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

  const fetchChangePassword = async () =>
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatVisibility: Visibility.PROTECTED,
        password: password,
      }),
    })
      .then((response) => {
        if (response.ok) {
          //roomContextArgs.getChatInfo(roomContextArgs.chat);
          chatPageContext.updateChat().catch((error) => {
            console.log(error);
          });
          navigate(backroute);
          setDialog("Password updated");
        } else throw new Error("Error changing password");
      })
      .catch((error) => {
        console.log(error);
      });

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
    await fetchChangePassword();
  };

  return (
    <>
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
      <button onClick={() => validateConfirm()}>set password</button>
      <button onClick={() => navigate(backroute)}>back</button>
    </>
  );
}
