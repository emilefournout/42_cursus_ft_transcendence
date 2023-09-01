import React, { useEffect, useState } from "react";
import SEO from "../../../components/Seo";
import "./GameCreateGamePage.css";
import { GameSocket } from "../../../services/socket";
import { useNavigate } from "react-router-dom";

export function GameCreateGamePage() {
	const [hiddenForm, setHiddenForm] = useState(false)
	const [maxGoals, setMaxGoals] = useState(10)
  	const [speed, setSpeed] = useState(1);
  	const [powerUps, setPoweUps] = useState(false);
	const navigate = useNavigate();
	const gameSocket = GameSocket.getInstance().socket;
	const MAX_GOALS = 25;
	const MIN_GOALS = 5;

	useEffect(() => {
		gameSocket.off("game_found");
		gameSocket.on("game_found", (gameId) => {
			navigate(`../${gameId}`);
		});
		return (() => {
			gameSocket.emit("leave_waiting_room");
			gameSocket.off("game_found");
		})
	}, [gameSocket, navigate]);

	return (
		<>
			<SEO
				title="Pong - Create a game"
				description="Customize your game and start playing."
			/>
			<div className="wrapper-matchmaking">
				{
					!hiddenForm &&
					<>
						<p className="create-game-title">Create a new game!</p>
						<fieldset>
							<label htmlFor="numberOfGoals" >Number of Goals (5 - 25)</label>
							<input id="numberOfGoals" type="number" min={MIN_GOALS} max={MAX_GOALS} value={maxGoals} onChange={checkValueLimits}/>
							<label htmlFor="speedControl" >SpeedControl</label>
							<input id="speedControl" type="range" min={0.75} max={1.25} step={0.01} value={speed}
							onChange={(event) => {
								try {
									setSpeed(Number(event.target.value))
								} catch {
									setSpeed(1)
								}
							}}/>
							<label htmlFor="powerUp">PowerUps</label>
							<input id="powerUp" type="checkbox" defaultChecked={powerUps}
								onClick={(event) => {
									setPoweUps(!powerUps)}
								}
							/>
						</fieldset>
						<button className="btn game-creation-btn create-game-btn btn-bottom"
							onClick={(event) =>
								{
									gameSocket.emit("create_room",
										{
											speed,
											maxGoals,
											powerUps
										}
									);
									setHiddenForm(true)
								}
							}
						>
							Create
						</button>
					</>
				}
				{
					hiddenForm && 
					<>
						<div className="matchmaking-loader"></div>
						<p className="matchmaking-scaling">Finding new rival for you</p>
					</>
				}
			</div>
		</>
	);

	function checkValueLimits(event: React.ChangeEvent<HTMLInputElement>) {
		const value: number = parseInt(event.target.value);
		if (Number.isInteger(value)){
			if (value > MAX_GOALS)
				setMaxGoals(MAX_GOALS);
			else if (value < MIN_GOALS)
				setMaxGoals(MIN_GOALS);
			else
				setMaxGoals(value);
		}
	};
}
