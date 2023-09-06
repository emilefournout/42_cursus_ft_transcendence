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
      <div className="history-user-name ellipsed-txt" title={props.me.username}>
        @{props.me.username}
      </div>
      <div
        className={
          props.result === "Victory"
            ? "history-txt history-txt-win"
            : "history-txt history-txt-loose"
        }
      >
        {props.me.score}
      </div>
      <img
        src={props.result === "Victory" ? SwordsIcon : SkullIcon}
        alt={props.result === "Victory" ? "Winner icon" : "Defeat icon"}
      />
      <div
        className={
          props.result === "Defeat"
            ? "history-txt history-txt-win"
            : "history-txt history-txt-loose"
        }
      >
        {props.opponent.score}
      </div>
      <div
        className="history-user-name ellipsed-txt"
        title={props.opponent.username}
      >
        @{props.opponent.username}
      </div>
    </div>
  );
}
