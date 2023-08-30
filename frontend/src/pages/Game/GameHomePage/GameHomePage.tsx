import React from "react";
import SEO from "../../../components/Seo";
import { Link } from "react-router-dom";

export function GameHomePage() {
  return (
    <>
      <SEO
        title="Pong - Game"
        description="Start a game with someone from the Internet with matchmaking or invite one of your friends."
      />
      <Link to="/board/game/newGame">
        <button className="btn btn-fixed-height">Create a new game</button>
      </Link>
      <Link to="/board/game/matchmaking">
        <button className="btn btn-fixed-height">Matchmaking</button>
      </Link>
      {/*separator or*/}
      {/*Invite Friend Form*/}
    </>
  );
}
