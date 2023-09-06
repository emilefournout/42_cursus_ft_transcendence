import React from "react";
import sideBar from "./SideBar.svg";
import "./SideBar.css";

export function SideBar() {
  return <img className={"bar"} src={sideBar} alt="sideBar" />;
}
