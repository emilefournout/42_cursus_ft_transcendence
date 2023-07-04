import { Link } from "react-router-dom";
import React from "react";

export function HomePage() {
  return (
    <>
      <h1>HomePage</h1>
      <Link to="/">
        <button>Disconnect</button>
      </Link>

      <Link to="/Game">
        <button>Play</button>
      </Link>
    </>
  );
}
