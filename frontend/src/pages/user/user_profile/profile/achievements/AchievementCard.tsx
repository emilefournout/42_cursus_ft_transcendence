import React from "react";
import "./../ranking/Ranking.css";
import notfoundIcon from "../../full_achievements/AchivementIcons/notfoundIcon.svg";
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
		"What A Player": ["Weird", pill],
		"Esport Trainee": ["Supa Strange", clock]
	};
	const colourDict:CDType = {
		"Plain": "var(--Trans-Light-Text-Extra)",
		"Weird": "var(--Trans-Crisped-Orange)",
		"Supa Strange": "var(--Trans-Mooned-Teal-Strong)",
		"Cryptid": "var(--Trans-Cosmic-Purple)"
	};

	const achColour = props.title in achDictionary && achDictionary[props.title][0] in colourDict ? colourDict[achDictionary[props.title][0]] : "var(--Trans-Paled-Beige)";
	const achImg = props.title in achDictionary ? achDictionary[props.title][1] : notfoundIcon;

	return (
		<div className="ach-card-container">
			<div className="ach-card-title ellipsed-txt" title={`${props.title} achievement`}>{props.title}</div>
			<div className="ach-card-subtitle ellipsed-txt" title={props.description}>{props.description}</div>
			<div className="ach-card-back" style={{backgroundColor: achColour}}></div>
			<img className="ach-card-img" src={achImg} alt={`${props.title} icon`}/>
		</div>
	);
}
