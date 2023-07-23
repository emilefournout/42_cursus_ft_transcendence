import React, { useEffect, useState } from "react";
import { GameCanvas, GameCanvasProps } from "./GameCanvas";
import { gameSocket } from "../../../services/socket";

export function GamePlayPage() {
  const boardState: GameCanvasProps = {
    width: 600,
    height: 350,
    padWidth: 10,
    padHeight: 60,
    ballRadius: 8,
    socket: null,
    leftPad: 100,
    rightPad: 150,
    ballX: 100,
    ballY: 150,
  };

  const [state, updateGameState] = useState(boardState);

  gameSocket.on("update", (data: any) => {
    updateGameState(data);
  });

  // let start = Date.now();
  // requestAnimationFrame(function animate(timestamp) {
  //   let interval = Date.now() - start;
  //   setState((state) => ({ ...state, ballX: state.ballX + interval / 100 }));
  //   console.log(interval);
  //   if (interval < 50) requestAnimationFrame(animate);
  // });
  // setInterval(() => {
  //   setState((state) => ({
  //     ...state,
  //     ballX: state.ballX + 1,
  //     ballY: state.ballY + 1,
  //   }));
  //   // console.log('update', state.ballX)
  // }, 5000);

  return (
    <>
      <h1 className="title">Game</h1>
      <GameCanvas {...state} />
    </>
  );
}
