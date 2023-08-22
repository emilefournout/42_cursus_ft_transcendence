import React from "react";
import { UserScore } from "./MatchHistory";
import "../Profile.css";

export enum MatchResult {
	victory = "Victory",
	defeat = "Defeat",
}

interface MatchHistoryCardProps {
	result: MatchResult;
	opponent: UserScore;
	me: UserScore;
	key: number;
}

export function MatchHistoryCard(props: MatchHistoryCardProps) {
	return (
		<div>
			<div>@{props.me.username}</div>
			<div>{props.me.score}</div>
			<div>{props.result}</div>
			<div>{props.opponent.score}</div>
			<div>@{props.opponent.username}</div>
		</div>
	);
}
