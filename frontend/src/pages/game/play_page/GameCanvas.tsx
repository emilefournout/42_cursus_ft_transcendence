import React, { useEffect, useRef } from "react";
import { GameSocket } from "../../../services/socket";
import { useParams } from "react-router-dom";

export interface GameCanvasProps {
  width: number;
  height: number;
  padWidth: number;
  padHeight: number;
  rightPadHeight: number;
  leftPadHeight: number;
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
      console.log(props.leftPadHeight, " - left Height")
      ctx.fillStyle = "white";
      ctx.fillRect(
        padWallSeparation,
        props.leftPad,
        props.padWidth,
        props.leftPadHeight
      );

      // Draw right pad
      // ctx.fillStyle = "white"
      console.log(props.leftPadHeight, " - right Height")
      ctx.fillRect(
        props.width - padWallSeparation - props.padWidth,
        props.rightPad,
        props.padWidth,
        props.rightPadHeight
      );

      // Draw ball
      // ctx.fillStyle = "white"
      ctx.beginPath();
      ctx.arc(props.ballX, props.ballY, props.ballRadius, 0, 2 * Math.PI);
      ctx.fill();
      // console.log("BALL", props.ballX, props.ballY);
    }
  });

  useEffect(() => {
    function handleKeyDown(event: any) {
      if (event.key === 'ArrowUp') {
        gameSocket.emit("move_user", {
          gameId: id,
          direction: "up",
        });
      } else if (event.key === "ArrowDown") {
        gameSocket.emit("move_user", {
          gameId: id,
          direction: "down",
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        width={props.width}
        height={props.height}
        style={{ border: "2px solid black" }}
      ></canvas>
    </>
  );
}