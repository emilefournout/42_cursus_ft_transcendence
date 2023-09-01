import React, { useEffect, useState } from "react";
import SEO from "../../../components/Seo";
import "./GameCreateGamePage.css";
import { GameSocket } from "../../../services/socket";
import { useNavigate } from "react-router-dom";

export function GameCreateGamePage() {
	const [numberValue, setValue] = useState(10)
	const navigate = useNavigate();
	const gameSocket = GameSocket.getInstance().socket;
	const username: string | null = localStorage.getItem("username");
	let waiting = false;
	const MAX_GOALS = 25;
	const MIN_GOALS = 5;

	useEffect(() => {
		if (!waiting) {
			gameSocket.emit("create_room");
			waiting = true;
		}
		gameSocket.off("game_found");
		gameSocket.on("game_found", (gameId) => {
			navigate(`../${gameId}`);
		});
	}, []);

	return (
		<>
			<SEO
				title="Pong - Create a game"
				description="Customize your game and start playing."
			/>
			<div className="wrapper-matchmaking">
				<p className="create-game-title">Create a new game!</p>
				<fieldset>
					<label htmlFor="numberOfGoals" >Number of Goals (5 - 25)</label>
					<input id="numberOfGoals" type="number" min={MIN_GOALS} max={MAX_GOALS} value={numberValue} onChange={checkValueLimits}/>
					<label htmlFor="speedControl" >SpeedControl</label>
					<input id="speedControl" type="range" min={0.75} max={1.25} step={0.01} defaultValue={1}/>
					<label htmlFor="powerUp">PowerUps</label>
					<input id="powerUp" type="checkbox"/>
				</fieldset>
				<button className="btn game-creation-btn create-game-btn btn-bottom">
					Create (TODO)
				</button>
			</div>
		</>
	);

	function checkValueLimits(event: React.ChangeEvent<HTMLInputElement>) {
		const value: number = parseInt(event.target.value);
		if (Number.isInteger(value)){
			if (value > MAX_GOALS)
				setValue(MAX_GOALS);
			else if (value < MIN_GOALS)
				setValue(MIN_GOALS);
			else
				setValue(value);
		}
	};
}
