import React from "react";
import { AchievementCard } from "../Profile/Achievements/AchievementCard";
export function FullAchievements() {
  return (
    <>
      <div>Achievements</div>
      {/*Friend Name*/}
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
