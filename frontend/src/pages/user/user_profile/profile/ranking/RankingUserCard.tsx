import React from "react";
import { Avatar } from "../../../../../components/Avatar";
import { User } from "../../../../board/Board";
import "./Ranking.css";

interface RankingUserCardProps {
  user: User;
  position: number;
  key: string;
}

export function RankingUserCard(props: RankingUserCardProps) {
  return (
    <div className="ranking-position-wrapper">
      <Avatar
        url={props.user.avatar}
        size="clamp(32px, 4vw, 64px)"
        upload={false}
        download={true}
      />
      <div className="ranking-position-rank">#{props.position}</div>
      <div className="ranking-position-user-name ellipsed-txt">
        {props.user.username}
      </div>
      <div className="ranking-position-wins">W: {props.user.wins}</div>
      <div className="ranking-position-looses">L: {props.user.loses}</div>
    </div>
  );
}
