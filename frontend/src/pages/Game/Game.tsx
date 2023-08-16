import React from "react";
import { GameHomePage } from "./GameHomePage/GameHomePage";
import { Outlet } from "react-router-dom";

export function Game() {
  return (
    <>
      <Outlet />
    </>
  );
}
