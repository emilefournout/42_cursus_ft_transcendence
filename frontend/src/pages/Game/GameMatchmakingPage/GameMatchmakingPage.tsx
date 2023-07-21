import React, { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo";
import { gameSocket } from "../../../services/socket";

export function GameMatchmakingPage() {
  // gameSocket.emit('join_waiting_room');
  console.log("HEY")
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
