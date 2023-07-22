import React, { useEffect, useRef } from "react";
import { gameSocket } from "../../../services/socket";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

export interface GameCanvasProps {
  width: number;
  height: number;
  padWidth: number;
  padHeight: number;
  ballRadius: number;
  socket: any;
  leftPad: number;
  rightPad: number;
  ballX: number;
  ballY: number;
}

export function GameCanvas(props: GameCanvasProps) {
  const padWallSeparation = 20;
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      console.log("BALL", props.ballX, props.ballY);
    }
  });

  const id = useParams();
  const access_token: string | undefined = Cookies.get("42token");

  useEffect(() => {
    function handleKeyDown(event: any) {
      if (event.keyCode === 38) {
        console.log("send keyup");
        gameSocket.emit("move_user", {
          playerId: access_token,
          gameId: id,
          direction: "up",
        });
      } else if (event.keyCode === 40) {
        gameSocket.emit("move_user", {
          playerId: access_token,
          gameId: id,
          direction: "down",
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [access_token, id]);

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
