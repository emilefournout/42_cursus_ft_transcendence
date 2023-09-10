import React from "react";
import "./../ranking/Ranking.css";
import power from "../../full_achievements/AchivementIcons/PowerIcon.svg";
import pill from "../../full_achievements/AchivementIcons/PillIcon.svg";
import clock from "../../full_achievements/AchivementIcons/ClockIcon.svg";

interface AchievementCardProps {
	title: string;
	description: string;
}

export function AchievementCard(props: AchievementCardProps) {
	interface ADType {
		[key: string]: string[];
	}
	interface CDType {
		[key: string]: string;
	}

	const achDictionary:ADType = {
		"First Win": ["Plain", power],
		"KO": ["Weird", pill],
		"eSport trainee": ["Supa Strange", clock]
	};
	const colourDict:CDType = {
		"Plain": "var(--Trans-Light-Text-Extra)",
		"Weird": "var(--Trans-Crisped-Orange)",
		"Supa Strange": "var(--Trans-Mooned-Teal-Strong)",
		"Cryptid": "var(--Trans-Cosmic-Purple)"
	};

	const achTitle = props.title;
	console.log(achDictionary[achTitle][1]);

	return (
		<div className="ach-card-container">
			<div className="ach-card-title ellipsed-txt" title={`${achTitle} achievement`}>{achTitle}</div>
			<div className="ach-card-subtitle ellipsed-txt" title={props.description}>{props.description}</div>
			<div className="ach-card-back" style={{backgroundColor: colourDict[achDictionary[props.title][0]]}}></div>
			<img className="ach-card-img" src={achDictionary[achTitle][1]} alt={`${props.title} icon`}/>
		</div>
	);
}
