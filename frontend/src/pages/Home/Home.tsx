import { Link } from "react-router-dom";
import React from "react";
import Chat from "../../components/Chat";
import SEO from "../../components/Seo";
import { NavBar } from "../../components/NavBar/NavBar";

export function Home() {
  return (
    <>
    <SEO title={"Pong - Home"} description={"Home of the user"} />
      <NavBar/>
      <h1 className="title">We don't know what to put here</h1>
      {/* <Chat /> */}
      <Link to="/">
        <button className="btn btn-fixed-height" onClick={() => localStorage.removeItem('access_token')}>Disconnect</button>
      </Link>
    </>
  );
}
