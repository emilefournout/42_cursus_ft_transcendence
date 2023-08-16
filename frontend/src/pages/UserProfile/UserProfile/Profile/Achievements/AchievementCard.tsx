import React from "react";

interface Props {
  title: String;
  description: String;
  image: String;
}
export function AchievementCard({ title, description, image }: Props) {
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <img src={image.toString()} />
    </div>
  );
}
