import React, { useContext, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";
import "../../../../root/Dialog.css";
import { devlog } from "../../../../../services/core";
import { ErrorBody } from "../RoomParam";
import { ChatPageContext } from "../../../Chat";

interface MuteDialogProps {
  userIdToMute: number | undefined;
  setUserIdToMute: (open: number | undefined) => void;
}

export function MuteDialog(props: MuteDialogProps) {
  const [value, setValue] = useState(30);
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const chatPageContext = useContext(ChatPageContext);
  const close = () => {
    props.setUserIdToMute(undefined);
  };
  const mute = (time: number) =>
    fetch(
      `${process.env.REACT_APP_BACKEND}/chat/${roomContextArgs.chat.id}/mute`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: props.userIdToMute, muteTime: time }),
      }
    )
      .then((response) => {
        if (!response.ok) {
          response
            .json()
            .then((data: ErrorBody) => {
              if (data.message && data.message === "User not in chat") {
                chatPageContext.updateLeaver("You are not member of this chat");
              }
              return;
            })
            .catch((error) => {
              devlog(error);
            });
        }
        roomContextArgs.getChatInfo(roomContextArgs.chat);
      })
      .then(() => {
        close();
      })
      .catch((error) => {
        devlog(error);
      });

  return (
    <div>
      {props.userIdToMute !== undefined ? (
        <dialog className="dialog-window wrapper-col">
          {value} minutes
          <input
            id="mute"
            type="range"
            min={15}
            max={90}
            step={1}
            value={value}
            onChange={(event) => {
              try {
                setValue(Number(event.target.value));
              } catch {
                setValue(30);
              }
            }}
          />
          <button onClick={() => mute(value * 60000)}>Mute</button>
          <button onClick={close}>Cancel</button>
        </dialog>
      ) : (
        <></>
      )}
    </div>
  );
}
