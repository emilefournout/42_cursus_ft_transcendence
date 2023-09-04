import React, { useEffect, useState } from "react";
import "../Profile.css";
import { useNavigate } from "react-router-dom";
import { Achievement } from "../../full_achievements/FullAchievement";
import { AchievementCard } from "./AchievementCard";

interface AchievementsProps {
	userId: number;
}

export function Achievements(props: AchievementsProps) {
	const navigate = useNavigate();
	const [achievements, setAchievements] = useState<
		Array<Achievement> | undefined
	>(undefined);

	useEffect(() => {
		fetch(`${process.env.REACT_APP_BACKEND}/achievements/${props.userId}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error getting achievements");
				}
				return response.json();
			})
			.then((data) => {
				setAchievements([
					...data,
					{
						name: "this is a test achievements",
						description: "don't forget to remove it from the frontend code",
					},
					{
						name: "this is also a test achievements",
						description:
							"don't forget to also remove it from the frontend code",
					},
				]);
				{
					/*TODO remove test achievements*/
				}
			})
			.catch((error) => {
				console.log(error);
			});
		return () => {};
	}, [props.userId]);

	if (achievements === undefined) {
		return <>Loading</>;
	} else {
		return (
			<div id="achievements-card">
				<div className="window-title card-title">Achievements</div>
				<div id="achievements-values" className="card-body">
					<button onClick={() => navigate("/board/user-account/achievements")}>
						Full achievements
					</button>
					{achievements.map((achievement: Achievement, index) => {
						return (
							<AchievementCard
								title={achievement.name}
								description={achievement.description}
								key={index}
							/>
						);
					})}
				</div>
			</div>
		);
	}
}
