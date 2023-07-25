import React, { useEffect, useRef } from "react";
import { GameSocket } from "../../../services/socket";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export interface GameCanvasProps {
  width: number;
  height: number;
  padWidth: number;
  padHeight: number;
  ballRadius: number;
  leftPad: number;
  rightPad: number;
  ballX: number;
  ballY: number;
}

export function GameCanvas(props: GameCanvasProps) {
  const padWallSeparation = 20;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { id } = useParams();
  const access_token: string | undefined = Cookies.get("42token"); // Shoud be used LocalStorage  
  const gameSocket = GameSocket.getInstance().socket;
  
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      // Draw board
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, props.width, props.height);

      // Draw middle line
      ctx.setLineDash([15, 10]);
      ctx.beginPath();
      ctx.moveTo(props.width / 2, 0);
      ctx.lineTo(props.width / 2, props.height);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 5;
      ctx.stroke();

      // Draw left pad
      ctx.fillStyle = "white";
      ctx.fillRect(
        padWallSeparation,
        props.leftPad,
        props.padWidth,
        props.padHeight
      );
      // Draw right pad
      // ctx.fillStyle = "white"
      ctx.fillRect(
        props.width - padWallSeparation - props.padWidth,
        props.rightPad,
        props.padWidth,
        props.padHeight
      );

      // Draw ball
      // ctx.fillStyle = "white"
      ctx.beginPath();
      ctx.arc(props.ballX, props.ballY, props.ballRadius, 0, 2 * Math.PI);
      ctx.fill();
      // console.log("BALL", props.ballX, props.ballY);
    }
  });
  function handleKeyDown(event: any) {
      if (event.key === 'ArrowUp') {
        gameSocket.emit("move_user", {
          playerId: Cookies.get("42token"),
          gameId: id,
          direction: "up",
        });
      } else if (event.key === "ArrowDown") {
        gameSocket.emit("move_user", {
          playerId: Cookies.get("42token"),
          gameId: id,
          direction: "down",
        });
      }
    }

  return (
    <>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        style={{ border: "2px solid black" }}
        onKeyDown={handleKeyDown}
      ></canvas>
    </>
  );
}
