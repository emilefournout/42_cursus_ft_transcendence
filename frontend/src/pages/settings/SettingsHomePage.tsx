import React, { useState } from "react";
import "./SettingsHomePage.css"

import { Link } from "react-router-dom";

import { Avatar } from "../../components/Avatar";
import TwoFactorAuth from "../../components/TwoFactorAuth";
import { BoardContext } from "../board/Board";
export function SettingsHomePage() {
	const [showQr, setShowQr] = useState(false);
	const boardContext = React.useContext(BoardContext);
	
	return (
		<div className="wrapper-matchmaking">
			<Avatar upload={true} download={true}/>
			<div className="underline settings-line-margin"></div>
			<div className="settings-user-name ellipsed-txt">{"@" + (boardContext? boardContext.me.username : "Not found")}</div>
			<Link className="settings-fixed-height settings-change-user-name btn btn-bottom settings-btn-txt settings-btn-txt" to={"/board/settings/update"}>
				Change username
			</Link>
			<div className="underline settings-line-margin"></div>
			<div className="settings-bottom-container">
				{(boardContext && showQr && <TwoFactorAuth username={boardContext.me.username}/>)}
				<button className="settings-fixed-height btn settings-btn-txt" onClick={() => setShowQr(!showQr)}>Set 2FA</button>
				<Link className="settings-fixed-height btn settings-disconnect settings-btn-txt" to="/login"
					onClick={() => {
						localStorage.removeItem("access_token");
				}}>
					Disconnect
				</Link>
			</div>
		</div>
	);
}
