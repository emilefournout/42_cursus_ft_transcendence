import React, { useState } from "react";
import { VisibilityButton } from "./VisibilityButton";
import validator from "validator";
import "./RoomCreate.css";
import { ChatSocket } from "../../../../services/socket";
import { ChatInfo, ChatPageContext } from "../../Chat";
import { useNavigate } from "react-router-dom";
import { Dialog } from "../../../../components/Dialog";

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
  const chatSocket = ChatSocket.getInstance().socket;
  const [selected, setSelected] = useState<Visibility>(Visibility.PUBLIC);
  const [passwordSecurity, setPasswordSecurity] = useState(
    passwordStrength.EMPTY
  );
  const [passwordErrorMessage, setPasswordErrorMessage] = useState(
    passwordStrength.EMPTY.toString()
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [dialog, setDialog] = useState<string | undefined>(undefined);

  const chatPageContext = React.useContext(ChatPageContext);
  const navigate = useNavigate();
  const clearState = (): void => {
    setPasswordSecurity(passwordStrength.EMPTY);
    setPasswordErrorMessage(passwordStrength.EMPTY.toString());
    setPassword("");
    setConfirm("");
    setName("");
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
  const fetchCreateRoom = async (chatVisibility: string): Promise<void> => {
    fetch(`${process.env.REACT_APP_BACKEND}/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatVisibility: chatVisibility,
        ...(name.length > 0 && { name: name }),
        ...(chatVisibility === "PROTECTED" && { password: password }),
      }),
    })
      .then((response) => {
        clearState();
        if (!response.ok) {
          setErrorMessage("Error while creating room");
          response.json().then((data) => {
            setErrorMessage(data.message[0]);
          });
          throw new Error();
        }
        return response.json();
      })
      .then((newChat: ChatInfo) => {
        setDialog("Room created");
        setTimeout(() => {
          chatPageContext.updateChat();
          navigate(`/board/chats/${newChat.id.toString()}`);
        }, 500);
        chatSocket.emit("join_room", { chatId: newChat.id });
      })
      .catch((error) => {
        clearState();
        //setErrorMessage(error.message);
        console.error("Erreur lors de la requête Fetch:" + error.message);
      });
  };
  const validateConfirm = async (): Promise<void> => {
    if (selected === Visibility.PROTECTED) {
      if (passwordSecurity !== passwordStrength.STRONG) {
        setPasswordErrorMessage(passwordSecurity.toString());
        return;
      } else if (password !== confirm) {
        setPasswordErrorMessage("Passwords do not match");
        return;
      } else {
        setPasswordErrorMessage(passwordStrength.STRONG.toString());
      }
    }
    await fetchCreateRoom(selected);
  };

  return (
    <>
      <Dialog dialog={dialog} setDialog={setDialog} />
      <div className="wrapper-new-room">
        <h2 className="txt-light">Create a new room</h2>
        <input
          type="text"
          placeholder="Room name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
            <div id="txt-password-strength">{passwordErrorMessage}</div>
          </>
        )}
        <div>{errorMessage}</div>
        <button onClick={() => validateConfirm()}>create room</button>
      </div>
    </>
  );
}
