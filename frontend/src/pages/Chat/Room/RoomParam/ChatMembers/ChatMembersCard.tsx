import React, { useState } from "react";
import { Member, RoomContextArgs } from "../../Room";
import { Slider } from "@mui/material";
import { MuteDialog } from "./MuteDialog";
import { set } from "js-cookie";
import { useOutletContext } from "react-router-dom";

export interface ChatMembersCardProps {
  member: Member;
  key: number;
}
export function ChatMembersCard(props: ChatMembersCardProps) {
  const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
  const roomContextArgs = useOutletContext<RoomContextArgs>();

  const action = (route: string, method: string, body: string) =>
    fetch(`${process.env.REACT_APP_BACKEND}/${route}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: body,
    }).then((response) => {
      if (!response.ok) throw new Error("Error while muting");
      roomContextArgs.getChatInfo(roomContextArgs.chat);
    });

  const promote = () =>
    action(
      `chat/${props.member.chatId}/user`,
      "PATCH",
      JSON.stringify({
        userId: props.member.userId,
        role: {
          owner: false,
          administrator: true,
        },
      })
    ).catch((error) => console.log(error));

  const demote = () =>
    action(
      `chat/${props.member.chatId}/user`,
      "PATCH",
      JSON.stringify({
        userId: props.member.userId,
        role: {
          owner: false,
          administrator: false,
        },
      })
    ).catch((error) => console.log(error));

  const mute = (time: number) =>
    action(
      `chat/${props.member.chatId}/mute`,
      "POST",
      JSON.stringify({ userId: props.member.userId, muteTime: time })
    )
      .then(() => {
        setIsMuteDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  const unmute = () => {
    action(
      `chat/${props.member.chatId}/mute`,
      "DELETE",
      JSON.stringify({ userId: props.member.userId })
    ).catch((error) => console.log(error));
  };
  const kickOut = () =>
    action(
      `chat/${props.member.chatId}/user`,
      "DELETE",
      JSON.stringify({ id: props.member.userId })
    ).catch((error) => console.log(error));

  return (
    <div>
      <MuteDialog
        open={isMuteDialogOpen}
        setOpen={setIsMuteDialogOpen}
        mute={mute}
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {props.member.userId}
        {props.member.owner
          ? " : owner"
          : props.member.administrator
          ? " : admin"
          : " : user"}
        {props.member.owner ? (
          <></>
        ) : (
          <>
            {props.member.administrator ? (
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
