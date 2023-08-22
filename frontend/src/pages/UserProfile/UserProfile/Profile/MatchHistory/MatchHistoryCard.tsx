import React from "react";
import { UserScore } from "./MatchHistory";
import "../Profile.css";
import SkullIcon from "./SkullIcon.svg";
import SwordsIcon from "./SwordsIcon.svg";

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
			<div className="history-user-name ellipsed-txt">@{props.me.username}</div>
			<div className={props.result === "Victory" ? "history-txt-win" : "history-txt-loose"}>{props.me.score}</div>
			<img src={props.result === "Victory" ? SwordsIcon : SkullIcon}/>
			<div className={props.result === "Defeat" ? "history-txt-win" : "history-txt-loose"}>{props.opponent.score}</div>
			<div className="history-user-name ellipsed-txt">@{props.opponent.username}</div>
		</div>
	);
}
