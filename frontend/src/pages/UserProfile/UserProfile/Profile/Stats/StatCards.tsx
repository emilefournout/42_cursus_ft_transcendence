import React from "react";

export enum StatType {
  win = "Wins",
  lose = "Loses",
  rank = "Rank",
}

interface Props {
  statType: StatType;
  statValue: string;
}
export function StatCards({ statType, statValue }: Props) {
  return (
    <>
      <div>
        {statType}: {statValue}
      </div>
    </>
  );
}
