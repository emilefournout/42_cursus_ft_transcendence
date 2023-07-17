import { Link } from "react-router-dom";
import React from "react";

export function Game() {
  return (
    <>
      <h1>Game</h1>
      <Link to="/">
        <button>Disconnect</button>
      </Link>
      <Link to="/Home">
        <button>Finish game</button>
      </Link>
    </>
  );
}
