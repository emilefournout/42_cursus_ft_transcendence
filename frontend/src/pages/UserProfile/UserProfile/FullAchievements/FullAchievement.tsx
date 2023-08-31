import React, { useEffect, useState } from "react";
import { AchievementCard } from "../Profile/Achievements/AchievementCard";
export interface Achievement {
  name: string;
  description: string;
}
export function FullAchievements() {
  const [achievements, setAchievements] = useState<
    Array<Achievement> | undefined
  >(undefined);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/achievements/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error getting achievements");
        return response.json();
      })
      .then((data) => {
        setAchievements(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  if (achievements === undefined) {
    return <>loading</>;
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
          overflowY: "scroll",
        }}
      >
        Achievements
        <div>
          {achievements.map((achievement: Achievement) => {
            return (
              <AchievementCard
                title={achievement.name}
                description={achievement.description}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
