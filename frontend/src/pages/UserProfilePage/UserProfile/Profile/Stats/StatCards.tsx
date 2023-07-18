import React from "react";

enum StatType {
  "Wins",
  "Losses",
  "Rank",
}

interface Props {
  statType: StatType;
  statValue: number;
}
export function StatCards({ statType, statValue }: Props) {
  if (statType == StatType.Wins || statType == StatType.Losses) {
    return (
      <>
        <div>{statValue}</div>
        <div>{statType}</div>
      </>
    );
  } else if (statType == StatType.Rank) {
    return (
      <>
        <div>#{statValue}</div>
        <div>{statType}</div>
      </>
    );
  } else {
    throw new Error("Unknown StatType");
  }
}
