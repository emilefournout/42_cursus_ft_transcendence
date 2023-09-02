import React, { useEffect, useState } from "react";
import { AchievementCard } from "../profile/achievements/AchievementCard";
import { useNavigate } from "react-router-dom";

export interface Achievement {
	name: string;
	description: string;
}

export function FullAchievements() {
	const [achievements, setAchievements] = useState<
		Array<Achievement> | undefined
	>(undefined);
	const navigate = useNavigate();

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
		return (
			<div className="prof-cards-wrapper">
				Loading...
			</div>
		);
	} else {
		return (
			<div className="prof-cards-wrapper">
				<div className="window-module ranking-window">
					<div className="ranking-title">
						Achievements
					</div>
					<div className="wrapper-col all-ach-wrapper">
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
				<button onClick={() => navigate(-1)}>back</button>
			</div>
		);
	}
}
