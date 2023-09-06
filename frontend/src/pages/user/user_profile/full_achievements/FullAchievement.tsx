import React, { useContext, useEffect, useState } from "react";
import { AchievementCard } from "../profile/achievements/AchievementCard";
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../../../board/Board";
import { devlog, testing } from "../../../../services/core";

export interface Achievement {
  name: string;
  description: string;
}

export function FullAchievements() {
  const [achievements, setAchievements] = useState<
    Array<Achievement> | undefined
  >(undefined);
  const navigate = useNavigate();
  const boardContext = useContext(BoardContext);
  const userId = boardContext?.me.id;

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
        devlog(error);
      });
  }, [userId]);
  if (achievements === undefined) {
    return <div className="prof-cards-wrapper">Loading...</div>;
  } else {
    return (
      <div className="prof-cards-wrapper">
        <div className="window-module ranking-window">
          <div className="ranking-title">
            <button onClick={() => navigate(-1)}>X</button>
            <span>All achievements</span>
          </div>
          <div className="wrapper-col all-ach-wrapper">
            {achievements.map((achievement: Achievement) => {
              return (
                <AchievementCard
                  key={achievement.name}
                  title={achievement.name}
                  description={achievement.description}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
