import React from "react";
import { RankingUserCard } from "./RankingUserCard";
import { ProfilePageContext } from "../../../UserProfilePage";

export function Ranking() {
  const profilePageContext = React.useContext(ProfilePageContext);

  if (profilePageContext.ranking === undefined) {
    return <>Loading</>;
  } else if (profilePageContext.ranking.length === 0) {
    return <>No users found</>;
  } else {
    return (
      <>
        <h1>Ranking</h1>
        {profilePageContext.ranking.map((user, index) => {
          return (
            <RankingUserCard
              position={index + 1}
              key={user.id.toString()}
              user={user}
            />
          );
        })}
      </>
    );
  }
}
