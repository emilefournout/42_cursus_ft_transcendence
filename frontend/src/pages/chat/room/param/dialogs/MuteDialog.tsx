import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";
import "../../../../root/Dialog.css";
import { testing } from "../../../../../services/core";

interface MuteDialogProps {
  userIdToMute: number | undefined;
  setUserIdToMute: (open: number | undefined) => void;
}

export function MuteDialog(props: MuteDialogProps) {
  const [value, setValue] = useState(30);
  const roomContextArgs = useOutletContext<RoomContextArgs>();

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
        if (!response.ok) throw new Error("Error while muting");
        roomContextArgs.getChatInfo(roomContextArgs.chat);
      })
      .then(() => {
        close();
      })
      .catch((error) => {
        if (testing) console.log(error);
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
