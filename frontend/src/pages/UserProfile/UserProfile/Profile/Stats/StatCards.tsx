import React from "react";

export enum StatType {
  win = "Wins",
  lose = "Losses",
  rank = "Rank",
}

interface Props {
  statType: StatType;
  statValue: string;
}
export function StatCards({ statType, statValue }: Props) {
  return (
    <>
      <div>{statValue}</div>
      <div>{statType}</div>
    </>
  );
}
