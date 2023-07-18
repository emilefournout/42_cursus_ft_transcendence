import React from "react";
import { Stats } from "./Stats/Stats";
import { MatchHistory } from "./MatchHistory/MatchHistory";
import { Achievements } from "./Achievements/Achievements";
export function Profile() {
  return (
    <>
      {/*Avatar*/}
      {/*Username*/}
      <Stats />
      <Achievements />
      <MatchHistory />
    </>
  );
}
