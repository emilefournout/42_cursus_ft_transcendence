import React from "react";

export enum MatchResult {
  victory = "Victory",
  defeat = "Defeat",
}
interface Props {
  result: MatchResult;
  opponentName: String;
}
export function MatchHistoryCard({ result, opponentName }: Props) {
  return (
    <div>
      <div>{opponentName}</div>
      <div>{result}</div>
    </div>
  );
}
