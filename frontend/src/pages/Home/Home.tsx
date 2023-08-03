import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import React from "react";
import SEO from "../../components/Seo";
import { NavBar } from "../../components/NavBar/NavBar";

export function Home() {
  const location = useLocation();
  return (
    <>
      <SEO title={"Pong - Home"} description={"Home of the user"} />
      <NavBar />
      <Outlet />
      {location.pathname === "/" ? <Navigate to="/settings" /> : <></>}
    </>
  );
}
