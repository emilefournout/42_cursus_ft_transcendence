import React from "react";
import { AchievementCard } from "./AchievementCard";
export function Achievements() {
  return (
    <>
      <AchievementCard
        title={"You are the boss"}
        description={"Be in the first place in the ranking"}
        image={"https://i.imgur.com/3QXVhGw.png"}
      />
      <AchievementCard
        title={"Wow what a player"}
        description={"Win a game without losing any point"}
        image={"https://i.imgur.com/3QXVhGw.png"}
      />
      <AchievementCard
        title={"Pro pong certified"}
        description={"Be in the first place in the ranking"}
        image={"Win a game in 1 minute"}
      />
    </>
  );
}
