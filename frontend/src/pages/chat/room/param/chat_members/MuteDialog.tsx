import React, { useState } from "react";
import { Slider } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { RoomContextArgs } from "../../Room";

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
        console.log(error);
      });

  return (
    <div>
      <dialog open={props.userIdToMute !== undefined}>
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          <button onClick={close}>cancel</button>
          <button onClick={() => mute(value * 60000)}>mute</button>
        </div>
      </dialog>
    </div>
  );
}
