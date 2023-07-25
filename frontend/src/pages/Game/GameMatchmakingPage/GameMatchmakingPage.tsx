import React, { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../components/Seo";
import { GameSocket } from "../../../services/socket";

export function GameMatchmakingPage() {
  const navigate = useNavigate()
  const gameSocket = GameSocket.getInstance().socket;
  const username: string | null = localStorage.getItem('username')
  let waiting = false

  useEffect(() => {
    if (!waiting) {
      gameSocket.emit('join_waiting_room', username);
      waiting = true
    }
    gameSocket.off('game_found')
    gameSocket.on('game_found', gameId => {
      navigate(`../${gameId}`)
    })
  }, [])

  return (
    <>
      <SEO
        title="Pong - Matchmaking"
        description='Start a game with someone from the Internet or one of your friends.' />
        <div className="container">
          <div className="loader"></div>
          <p className="title">Finding new rival for you</p>
          <Link to="/home">
            <button className="btn btn-fixed-height">Cancel</button>
          </Link>
        </div>
    </>
  );
}
