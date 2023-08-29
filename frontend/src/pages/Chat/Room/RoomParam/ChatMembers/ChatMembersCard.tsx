import React, { useState } from "react";
import { Member } from "../../Room";
import { Slider } from "@mui/material";
import { MuteDialog } from "./MuteDialog";
import { set } from "js-cookie";

export interface ChatMembersCardProps {
  member: Member;
  key: number;
}
export function ChatMembersCard(props: ChatMembersCardProps) {
  const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
  const promote = () => {
    console.log("promote");
  };
  const demote = () => {
    console.log("demote");
  };
  const mute = (time: number) =>
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${props.member.chatId}/mute`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: props.member.userId,
        muteTime: time,
      }),
    });
  const unmute = () => {
    console.log("unmute");
  };
  const kickOut = () => {
    console.log("kick out");
  };

  return (
    <div>
      <MuteDialog
        open={isMuteDialogOpen}
        setOpen={setIsMuteDialogOpen}
        mute={mute}
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {props.member.userId}
        {props.member.administrator
          ? " : admin"
          : props.member.owner
          ? " : owner"
          : " : user"}
        {props.member.administrator ? (
          <></>
        ) : (
          <>
            {props.member.owner ? (
              <button onClick={demote}>demote</button>
            ) : (
              <button onClick={promote}>promote</button>
            )}
            {props.member.muted ? (
              <button onClick={unmute}>unmute</button>
            ) : (
              <button onClick={() => setIsMuteDialogOpen(true)}>mute</button>
            )}
            <button onClick={kickOut}>kick out</button>
          </>
        )}
      </div>
    </div>
  );
}
