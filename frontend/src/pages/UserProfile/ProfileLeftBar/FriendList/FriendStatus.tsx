import React from "react";
import "./FriendCard/FriendCard.css";
import ingameIcon from "./FriendCard/AcceptedFriendCard/ingameIcon.svg";

export enum UserStatus {
	Online = "ONLINE",
	Offline = "OFFLINE",
	InGame = "INGAME",
}

interface Props {
	status: string;
}

export function FriendStatus({ status }: Props) {
	if (status === UserStatus.Online) {
		return <div className="friend-card-status friend-card-username">
				<div className="friend-card-status-marker" style={{background: "var(--Mooned-Teal)"}}></div>
				Online
				</div>;
	} else if (status === UserStatus.Offline) {
		return <div className="friend-card-status friend-card-subtitle">
				<div className="friend-card-status-marker" style={{background: "var(--Crisped-Orange)"}}></div>
				Offline
				</div>;
	} else if (status === UserStatus.InGame) {
		return <div className="friend-card-status friend-card-subtitle">
				<img src={ingameIcon} />
				In-game
				</div>;
	} else {
		throw new Error("Unknown StatType");
	}
}
