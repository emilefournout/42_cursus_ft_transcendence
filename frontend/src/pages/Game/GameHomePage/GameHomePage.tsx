import React from "react";
import SEO from "../../../components/Seo";
import { gameSocket } from "../../../services/socket";
import { Link } from "react-router-dom";

export function GameHomePage() {
  gameSocket.emit('join_waiting_room');
  return (
    <>
      <SEO
        title="Pong - Game"
        description='Start a game with someone from the Internet or one of your friends.' />
        <div className="wrapper-col">
          <p className="title">Finding new rival for you</p>
          <div className="loader">
          </div>
          <Link to="/home">
            <button className="btn btn-fixed-height">Cancel</button>
          </Link>
        </div>
      {/*Matchmaking button*/}
      {/*separator or*/}
      {/*Invite Friend Form*/}
    </>
  );
}
