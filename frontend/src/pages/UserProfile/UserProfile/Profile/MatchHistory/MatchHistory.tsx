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

interface MatchHistoryProps {
  userId: number;
}
export function MatchHistory(props: MatchHistoryProps) {
  const [history, setHistory] = React.useState<History[]>([]);
  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/history/${props.userId}`)
      .then((res) => res.json())
      .then((data) => setHistory(data));
  }, [props.userId]);
  return (
    <>
      {history.map((match) => {
        return (
          <MatchHistoryCard
            result={MatchResult.defeat}
            opponentName={match.user1_username}
          />
        );
      })}
    </>
  );
}
