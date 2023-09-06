import React from "react";
import "./../ranking/Ranking.css";
import power from "../../full_achievements/AchivementIcons/PowerIcon.svg";

interface AchievementCardProps {
	title: string;
	description: string;
	//image: String;
}

export function AchievementCard(props: AchievementCardProps) {
	return (
		<div className="ach-card-container">
			<div className="ach-card-title ellipsed-txt" title={`${props.title} achievement`}>{props.title}</div>
			<div className="ach-card-subtitle ellipsed-txt" title={props.description}>{props.description}</div>
			<div className="ach-card-back"></div>
			<img className="ach-card-img" src={power} alt={`${props.title} icon`}/>
		</div>
	);
}
