import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../components/Seo";
import { GameSocket } from "../../../services/socket";
import "./GameMatchmakingPage.css";

export function GameMatchmakingPage() {
  const navigate = useNavigate();
  const gameSocket = GameSocket.getInstance().socket;
  const username: string | null = localStorage.getItem("username");
  let waiting = false;

  useEffect(() => {
    gameSocket.emit("join_waiting_room");
    gameSocket.on("game_found", (gameId) => {
      navigate(`../${gameId}`);
    });
    return (() => {
      gameSocket.emit("leave_waiting_room");
      gameSocket.off("game_found");
    })
  }, []);

  return (
    <>
      <SEO
        title="Pong - Matchmaking"
        description="Start a game with someone from the Internet or one of your friends."
      />
      <div className="wrapper-matchmaking">
        <div className="matchmaking-loader"></div>
        <p className="matchmaking-scaling">Finding new rival for you</p>
        <Link to="/board/game">
          <button className="btn btn-fixed-height matchmaking-scaling" onClick={() => gameSocket.emit("leave_waiting_room")}> 
            Cancel
          </button>
        </Link>
      </div>
    </>
  );
}
