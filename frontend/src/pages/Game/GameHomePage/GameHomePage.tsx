import React from "react";
import SEO from "../../../components/Seo";
import { Link } from "react-router-dom";
import "../Game.css";

export function GameHomePage() {
	return (
		<>
			<SEO
				title="Pong - Game"
				description="Start a game with someone from the Internet with matchmaking or invite one of your friends."
			/>
			<div className="wrapper-matchmaking">
				<Link className="btn game-creation-btn" to="/board/game/matchmaking">
					Matchmaking
				</Link>
				<div className="wrapper-row txt game-creation-divider">Or</div>
				<Link className="btn btn-bottom game-creation-btn" to="/board/game/newGame">
					Create a new game
				</Link>
			</div>
			{/*separator or*/}
			{/*Invite Friend Form*/}
		</>
	);
}
