import React from "react";
import { StatCards, StatType } from "./StatCards";

interface StatsProps {
  wins: number;
  loses?: number;
}
export function Stats(props: StatsProps) {
  return (
    <>
      <h1>Stats</h1>
      <StatCards statType={StatType.win} statValue={props.wins.toString()} />
      <StatCards statType={StatType.lose} statValue={"-1"} />
      <StatCards statType={StatType.rank} statValue={"-1"} />
    </>
  );
}
