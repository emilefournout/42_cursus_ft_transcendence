import React from "react";
import { RoomToolBar } from "./RoomToolBar/RoomToolBar";
import "./Room.css";
import { Outlet } from "react-router-dom";

export function Room() {
	return (
		<div className="wrapper-col wrapper-room">
			<RoomToolBar />
			<Outlet />
		</div>
	);
}
