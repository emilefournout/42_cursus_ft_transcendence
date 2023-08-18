import React from "react";
import { Avatar } from "../../../../../components/Avatar";
import { useNavigate } from "react-router-dom";
import { User } from "../../../../Board/Board";

interface RankingUserCardProps {
  user: User;
  position: number;
  key: string;
}
export function RankingUserCard(props: RankingUserCardProps) {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "15px" }}>
      <Avatar url={props.user.avatar} />
      <div>#{props.position}</div>
      <div>{props.user.username}</div>
      <div>win:{props.user.wins}</div>
      <div>lose:{props.user.loses}</div>
    </div>
  );
}
