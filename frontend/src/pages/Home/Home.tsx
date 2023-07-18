import { Link } from "react-router-dom";
import React from "react";
import Chat from "../../components/Chat";

export function Home() {
  return (
    <>
      <h1>Home</h1>
      <Chat />
      <Link to="/">
        <button>Disconnect</button>
      </Link>

      <Link to="/Game">
        <button>Play</button>
      </Link>
    </>
  );
}
