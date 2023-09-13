import React, { useContext, useState } from "react";
import "./SettingsHomePage.css";

import { Link } from "react-router-dom";

import { Avatar } from "../../components/Avatar";
import TwoFactorAuth from "../../components/TwoFactorAuth";
import { BoardContext } from "../board/Board";
import { DialogContext } from "../root/Root";
import { ChatSocket, GameSocket, UserSocket } from "../../services/socket";

export function SettingsHomePage() {
  const [showQr, setShowQr] = useState(false);
  const boardContext = React.useContext(BoardContext);
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;

  function updateUserImage(image: any) {
    const formData = new FormData();
    formData.append("image", image as File);

    fetch(`${process.env.REACT_APP_BACKEND}/profile`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    }).then((response) => {
      if (!response.ok)
        setDialog("User profile image could not be updated, try again");
    });
  }

  return (
    <div className="wrapper-matchmaking">
      <Avatar upload={true} download={true} setImg={updateUserImage} />
      <div className="underline settings-line-margin"></div>
      <div className="settings-user-name ellipsed-txt">
        {"@" + (boardContext ? boardContext.me.username : "Not found")}
      </div>
      <Link
        className="settings-fixed-height settings-change-user-name btn btn-bottom settings-btn-txt settings-btn-txt"
        to={"/board/settings/update"}
      >
        Change username
      </Link>
      <div className="underline settings-line-margin"></div>
      <div className="settings-bottom-container">
        <button
          className="settings-fixed-height btn settings-btn-txt"
          onClick={() => setShowQr(!showQr)}
        >
          Set 2FA
        </button>
        <Link
          className="settings-fixed-height btn settings-disconnect settings-btn-txt"
          to="/welcome"
          onClick={() => {
            localStorage.removeItem("access_token");
            ChatSocket.getInstance().socket.disconnect()
            GameSocket.getInstance().socket.disconnect()
            UserSocket.getInstance().socket.disconnect()
          }}
        >
          Disconnect
        </Link>
      </div>
      {boardContext && showQr && (
        <TwoFactorAuth username={boardContext.me.username} />
      )}
    </div>
  );
}
