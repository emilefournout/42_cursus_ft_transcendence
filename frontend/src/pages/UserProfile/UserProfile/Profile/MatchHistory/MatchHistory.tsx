import React from "react";
import { MatchHistoryCard, MatchResult } from "./MatchHistoryCard";

interface History {
  points_user1: number;
  points_user2: number;
  user1_id: number;
  user2_id: number;
  user1_username: string;
  user2_username: string;
}
export function MatchHistory() {
  const [history, setHistory] = React.useState<History[]>([]);
  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/history/${1}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, []);
  return (
    <>
      <MatchHistoryCard
        result={MatchResult.victory}
        opponentName={"Apena-ba"}
      />
      <MatchHistoryCard
        result={MatchResult.victory}
        opponentName={"Apena-ba"}
      />
      <MatchHistoryCard result={MatchResult.defeat} opponentName={"efournou"} />
      <MatchHistoryCard result={MatchResult.defeat} opponentName={"efournou"} />
      <MatchHistoryCard result={MatchResult.defeat} opponentName={"efournou"} />
    </>
  );
}
