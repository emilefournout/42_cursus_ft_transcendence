import React, { useEffect, useState } from "react";
import { GameCanvas, GameCanvasProps } from "./GameCanvas";
import { GameSocket } from "../../../services/socket";

export function GamePlayPage() {
  const gameSocket = GameSocket.getInstance().socket;
  const boardState: GameCanvasProps = {
    width: 600,
    height: 350,
    padWidth: 10,
    padHeight: 60,
    ballRadius: 8,
    leftPad: 100,
    rightPad: 150,
    ballX: 100,
    ballY: 150,
  };

  const [state, updateGameState] = useState(boardState);
  const [player1Score, updatePlayer1Score] = useState(0);
  const [player2Score, updatePlayer2Score] = useState(0);

  useEffect(() => {
    gameSocket.off("update");
    gameSocket.on("update", (data: any) => {
      updateGameState(data);
      updatePlayer1Score(data.player1Score);
      updatePlayer2Score(data.player2Score);
    });
  }, [])

  return (
    <>
      <h1 className="title">Game</h1>
      <div className="title">
        {player1Score} - {player2Score}
      </div>
      <GameCanvas {...state} />
    </>
  );
}
