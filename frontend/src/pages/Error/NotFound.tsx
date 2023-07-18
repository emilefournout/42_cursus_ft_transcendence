import { Link } from "react-router-dom";
import React from "react";
import Chat from "../../components/Chat";

export function NotFound() {
  return (
    <>
      <h1 className="title">Not found</h1>
      <Link to="/">
        <button>Come back to home</button>
      </Link>
    </>
  );
}
