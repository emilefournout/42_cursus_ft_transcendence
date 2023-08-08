import React from "react";
import { MatchHistoryCard, MatchResult } from "./MatchHistoryCard";

export function MatchHistory() {
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
