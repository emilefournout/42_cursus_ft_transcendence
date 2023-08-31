import React, { useState } from "react";
import { Visibility } from "../RoomCreate/RoomCreate";
import { useNavigate, useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../Room";
import { Dialog } from "../../../../components/Dialog";

export function UpdateVisibilityButtons() {
  const navigate = useNavigate();
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const [updateIsSelected, setUpdateIsSelected] = useState(false);
  const [dialog, setDialog] = useState<string | undefined>(undefined);
  const updateVisibility = (visibility: Visibility) => {
    if (visibility === roomContextArgs.chat.visibility) {
      setDialog("visibility is already set to " + visibility);
      return;
    }
    if (visibility === Visibility.PROTECTED) {
      navigate("changePassword");
      return;
    }
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ chatVisibility: Visibility.PUBLIC }),
    })
      .then((response) => {
        if (response.ok) {
          roomContextArgs.getChatInfo(roomContextArgs.chat);
          setDialog("visibility updated to " + Visibility.PUBLIC);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (roomContextArgs.chat === undefined) {
    return <></>;
  } else {
    return (
      <>
        <Dialog dialog={dialog} setDialog={setDialog} />
        current visibility : {roomContextArgs.chat.visibility}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          {updateIsSelected ? (
            <>
              <div onClick={() => updateVisibility(Visibility.PROTECTED)}>
                Protected
              </div>{" "}
              or{" "}
              <div onClick={() => updateVisibility(Visibility.PUBLIC)}>
                Public
              </div>
              <button onClick={() => setUpdateIsSelected(false)}>cancel</button>
            </>
          ) : (
            <button onClick={() => setUpdateIsSelected(true)}>
              update visibility
            </button>
          )}
        </div>
        <div style={{ padding: "10px" }}>
          {roomContextArgs.chat.visibility === Visibility.PROTECTED && (
            <button onClick={() => navigate("changePassword")}>
              change password
            </button>
          )}
        </div>
        <div style={{ padding: "10px" }}>
          <button onClick={() => navigate("delete")}>delete room</button>
        </div>
      </>
    );
  }
}
