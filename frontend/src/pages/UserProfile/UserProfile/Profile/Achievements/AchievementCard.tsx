import React from "react";

interface AchievementCardProps {
  title: String;
  description: String;
  //image: String;
}
export function AchievementCard(props: AchievementCardProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "25px",
      }}
    >
      <div>{props.title}</div>
      <div> {props.description}</div>
    </div>
  );
}
