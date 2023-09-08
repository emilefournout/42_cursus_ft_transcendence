import React, { useContext } from "react";
import { Member, RoomContextArgs } from "../../../Room";
import { useNavigate, useOutletContext } from "react-router-dom";
import ownerIcon from "./crownIcon.svg";
import adminIcon from "./shieldIcon.svg";
import promoteIcon from "./promote.svg";
import demoteIcon from "./demote.svg";
import muteIcon from "./mute.svg";
import unmuteIcon from "./unmute.svg";
import banIcon from "./ban.svg";
import unbanIcon from "./unban.svg";
import kickIcon from "./kick.svg";
import playIcon from "./play.svg";
import { MuteDialogContext } from "../../RoomParam";
import { devlog } from "../../../../../../services/core";
import { BoardContext } from "../../../../../board/Board";

export interface ChatMembersCardProps {
	member: Member;
	showButtons: boolean;
	key: number;
}

export function ChatMembersCard(props: ChatMembersCardProps) {
	const roomContextArgs = useOutletContext<RoomContextArgs>();
	const muteDialogContext = useContext(MuteDialogContext);
	const chadId = roomContextArgs.chat.id;
	const navigate = useNavigate();
	const boardContext = useContext(BoardContext);
	const isMe = boardContext?.me.id === props.member.userId;
	const style = isMe ? { backgroundColor: "var(--Trans-Mooned-Teal-Strong)" } : {};
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
		).catch((error) => {
			devlog(error);
		});

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
		).catch((error) => {
			devlog(error);
		});

	const unmute = () => {
		action(
			`chat/${chadId}/mute`,
			"DELETE",
			JSON.stringify({ userId: props.member.userId })
		).catch((error) => {
			devlog(error);
		});
	};
	const ban = () =>
	action(
		`chat/${chadId}/ban`,
		"POST",
		JSON.stringify({ userId: props.member.userId })
	).catch((error) => {
		devlog(error);
	});

	const kickOut = () =>
		action(
			`chat/${chadId}/user`,
			"DELETE",
			JSON.stringify({ id: props.member.userId })
		).catch((error) => {
			devlog(error);
		});

	if (!boardContext) {
		return <>Loading</>;
	} else {
		return (
			<>
				<div
					title={props.member.username}
					style={style}
					className="room-param-user-name ellipsed-txt"
					onClick={() => navigate(`/board/user-account/${props.member.userId}`)}
				>
					{props.member.username}
				</div>
				{props.member.owner ? (
					<img src={ownerIcon} title="Room Owner" alt="Room owner icon" />
				) : props.member.administrator ? (
					<img
						src={adminIcon}
						title="Room Admin"
						alt="Room administrator icon"
					/>
				) : (
					<></>
				)}
				{props.member.owner || !props.showButtons ? (
					<></>
				) : (
					<>
						{props.member.administrator ? (
							<img id="demote-btn" src={demoteIcon} onClick={demote} title="Demote user" />
						) : (
							<img id="promote-btn" src={promoteIcon} onClick={promote} title="Promote user" />
						)}
						{isMe ? (
							<></>
						) : (
							<>
								{props.member.muted ? (
									<img id="unmute-btn" src={unmuteIcon} onClick={unmute} title="Unmute user" />
								) : (
									<img
										id="mute-btn"
										src={muteIcon}
										onClick={() => muteDialogContext.mute(props.member.userId)}
										title="Mute user"
									/>
								)}
								<img id="ban-btn" src={banIcon} onClick={ban} title="Ban user" />
								<img id="kick-btn" src={kickIcon} onClick={kickOut} title="Kick out user" />
							</>
						)}
					</>
				)}
				{isMe ? (
					<></>
				) : (
					<>
						<img
							id="play-btn"
							src={playIcon}
							onClick={() => {
								navigate("/board/game/new-game", {
									state: {
										invite: props.member.username,
									},
								});
							}}
							title="Challenge to a match!"
						/>
					</>
				)}
			</>
		);
	}
}
