import React from "react";
import { StatCards, StatType } from "./StatCards";
import { ProfilePageContext } from "../../../UserProfilePage";

interface StatsProps {
  wins: number;
  loses: number;
  id: number;
}
export function Stats(props: StatsProps) {
  const profilePageContext = React.useContext(ProfilePageContext);
  const getRank = (): string | undefined => {
    const userPos: number | undefined = profilePageContext.ranking?.findIndex(
      (user) => user.id === props.id
    );
    if (userPos === undefined || userPos === -1) return undefined;
    return "#" + (userPos + 1).toString();
  };
  const rank = getRank();

  return (
    <div style={{ border: "5px solid" }}>
      <h1>Stats:</h1>
      <StatCards statType={StatType.win} statValue={props.wins?.toString()} />
      <StatCards statType={StatType.lose} statValue={props.loses?.toString()} />
      {rank && <StatCards statType={StatType.rank} statValue={rank} />}
    </div>
  );
}
