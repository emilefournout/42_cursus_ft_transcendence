import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../components/Seo";
import { GameSocket } from "../../../services/socket";
import "./GameMatchmakingPage.css";

export function GameMatchmakingPage() {
  const navigate = useNavigate();
  const gameSocket = GameSocket.getInstance().socket;
  let waiting = useRef(false);

  useEffect(() => {
    if (!waiting.current)
    {
      gameSocket.emit("join_waiting_room");
      gameSocket.off("game_found");
      gameSocket.on("game_found", (gameId) => {
        navigate(`../${gameId}`);
      });
      waiting.current = true
    }
    return (() => {
      waiting.current = false
      gameSocket.emit("leave_waiting_room");
    })
  }, [gameSocket, navigate]);

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
          <button className="btn btn-fixed-height matchmaking-scaling" onClick={() => {
            waiting.current = false
          }}> 
            Cancel
          </button>
        </Link>
      </div>
    </>
  );
}
