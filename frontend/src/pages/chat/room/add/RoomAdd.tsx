import React from "react";
import { useNavigate } from "react-router-dom";

export function RoomAdd() {
	const navigate = useNavigate();

	return (
		<div className="wrapper-new-room">
			<button id="item-margin-top" onClick={() => navigate("search")}>
				Join an existing chat room
			</button>
			<div style={{marginBottom: "16px"}}>or</div>
			<button id="item-margin-bot" onClick={() => navigate("create")}>Create a new chat room</button>
		</div>
	);
}
