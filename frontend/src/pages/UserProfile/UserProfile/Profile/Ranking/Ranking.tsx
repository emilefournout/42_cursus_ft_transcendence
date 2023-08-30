import React from "react";
import { RankingUserCard } from "./RankingUserCard";
import { ProfilePageContext } from "../../../UserProfilePage";
import "./Ranking.css";

export function Ranking() {
	const profilePageContext = React.useContext(ProfilePageContext);

	if (profilePageContext.ranking === undefined) {
		return <div className="prof-cards-wrapper">Loading</div>;
	} else if (profilePageContext.ranking.length === 0) {
		return <div className="prof-cards-wrapper">No users found</div>;
	} else {
		return (
			<div className="prof-cards-wrapper">
				<div className="window-module ranking-window">
					<div className="ranking-title">
						Ranking
					</div>
					<div className="ranking-positions-container">
						{profilePageContext.ranking.map((user, index) => {
							return (
								<RankingUserCard
									position={index + 1}
									key={user.id.toString()}
									user={user}
								/>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
