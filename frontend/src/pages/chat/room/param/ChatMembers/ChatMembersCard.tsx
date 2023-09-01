import React, { useContext, useState } from "react";
import { Member, RoomContextArgs } from "../../Room";
import { Slider } from "@mui/material";
import { MuteDialog } from "./MuteDialog";
import { set } from "js-cookie";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BoardContext } from "../../../../board/Board";
import ownerIcon from "./crownIcon.svg";
import adminIcon from "./shieldIcon.svg";

export interface ChatMembersCardProps {
	member: Member;
	showButtons: boolean;
	key: number;
}

export function ChatMembersCard(props: ChatMembersCardProps) {
	const [isMuteDialogOpen, setIsMuteDialogOpen] = useState(false);
	const roomContextArgs = useOutletContext<RoomContextArgs>();
	const chadId = roomContextArgs.chat.id;
	const navigate = useNavigate();

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
			`chat/${chadId}/user`,
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
			`chat/${chadId}/user`,
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
			`chat/${chadId}/mute`,
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
			`chat/${chadId}/mute`,
			"DELETE",
			JSON.stringify({ userId: props.member.userId })
		).catch((error) => console.log(error));
	};
	const kickOut = () =>
		action(
			`chat/${chadId}/user`,
			"DELETE",
			JSON.stringify({ id: props.member.userId })
		).catch((error) => console.log(error));

<<<<<<< HEAD:frontend/src/pages/Chat/Room/RoomParam/ChatMembers/ChatMembersCard.tsx
	return (
		<>
			<MuteDialog
				open={isMuteDialogOpen}
				setOpen={setIsMuteDialogOpen}
				mute={mute}
			/>
			<div
				className="room-param-user-name ellipsed-txt"
				onClick={() => navigate(`/board/userAccount/${props.member.userId}`)}
			>
				{props.member.username}
			</div>
			{props.member.owner
				? <img src={ownerIcon} title="Room Owner" />
				: props.member.administrator
				? <img src={adminIcon} title="Room Admin" />
				: <></>}
			{props.member.owner || !props.showButtons ? (
				<></>
			) : (
				<>
					{props.member.administrator ? (
						<button id="demote-btn" onClick={demote}>demote</button>
					) : (
						<button id="promote-btn" onClick={promote}>promote</button>
					)}
					{props.member.muted ? (
						<button id="unmute-btn" onClick={unmute}>unmute</button>
					) : (
						<button id="mute-btn" onClick={() => setIsMuteDialogOpen(true)}>mute</button>
					)}
					<button onClick={kickOut}>kick out</button>
				</>
			)}
		</>
	);
=======
  return (
    <div>
      <MuteDialog
        open={isMuteDialogOpen}
        setOpen={setIsMuteDialogOpen}
        mute={mute}
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        {props.member.username}
        {props.member.owner
          ? " : owner"
          : props.member.administrator
          ? " : admin"
          : " : user"}
        {props.member.owner || !props.showButtons ? (
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
        <button
          onClick={() => navigate(`/board/user-account/${props.member.userId}`)}
        >
          profile
        </button>
      </div>
    </div>
  );
>>>>>>> edaa0c7884992b0681d2995b2f6f991c5bcec3f3:frontend/src/pages/chat/room/param/ChatMembers/ChatMembersCard.tsx
}
