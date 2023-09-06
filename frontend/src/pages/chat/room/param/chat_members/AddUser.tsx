import React, { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";
import { DialogContext } from "../../../../root/Root";
import addChatterIcon from "../../../../../common/SquaredPlusIcon.svg";
import { devlog, testing } from "../../../../../services/core";

export function AddUser() {
  const [newUser, setNewUser] = useState<string>("");
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const roomContextArgs = useOutletContext<RoomContextArgs>();

  const addUser = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/info/username/${newUser}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          setDialog("User not found");
          throw new Error();
        }
      })
      .then((data) =>
        fetch(
          `${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}/user`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: data.id,
            }),
          }
        )
      )
      .then((response) => {
        if (response.ok) {
          setDialog("new member added to the room");
          setNewUser("");
          roomContextArgs.getChatInfo(roomContextArgs.chat);
        } else {
          setDialog("bad connection, try again");
          throw new Error();
        }
      })
      .catch((error) => {
        devlog(error);
      });
  };

  return (
    <>
      <input
        type="text"
        placeholder="Add new user"
        value={newUser}
        onChange={(e) => setNewUser(e.target.value)}
      />
      <img
        src={addChatterIcon}
        style={{ cursor: "pointer" }}
        onClick={addUser}
        alt="Add chat icon"
      />
    </>
  );
}
