import React from "react";
import "./../ranking/Ranking.css";

interface AchievementCardProps {
	title: String;
	description: String;
	//image: String;
}

export function AchievementCard(props: AchievementCardProps) {
	return (
		<div className="ach-card-container">
			<div className="ach-card-title">{props.title}</div>
			<div className="ach-card-subtitle">{props.description}</div>
			<div className="ach-card-back"></div>
			<img className="ach-card-img" src="" />
		</div>
	);
}
