import React from "react";
import SEO from "../../../components/Seo";
import { Link } from "react-router-dom";
import { GamePlayPage } from "../GamePlayPage/GamePlayPage";

export function GameHomePage() {
  console.log("HEY");
  return (
    <>
      <SEO
        title="Pong - Game"
        description="Start a game with someone from the Internet with matchmaking or invite one of your friends."
      />
      <Link to="/board/game/matchmaking">
        <button className="btn btn-fixed-height">Matchmaking</button>
      </Link>
      {/*Matchmaking button*/}
      {/*separator or*/}
      {/*Invite Friend Form*/}
    </>
  );
}
