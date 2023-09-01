import React from "react";
import logo from "./PongLogo.svg";
import "./PongLogo.css";
export function PongLogo() {
  return <img className={"logo"} src={logo} alt="logo" />;
}
