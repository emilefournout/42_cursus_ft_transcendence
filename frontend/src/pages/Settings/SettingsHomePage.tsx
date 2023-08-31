import React, { useState } from "react";
import "./SettingsHomePage.css"

import { Link } from "react-router-dom";

import { Avatar } from "../../components/Avatar";
import TwoFactorAuth from "../../components/TwoFactorAuth";
export function SettingsHomePage() {
	const [showQr, setShowQr] = useState(false);

	return (
		<div className="wrapper-matchmaking">
			<Avatar upload={true} download={true}/>
			<div className="underline settings-line-margin"></div>
			<div className="settings-user-name ellipsed-txt">{"@" + localStorage.getItem("username")}</div>
			<Link className="settings-fixed-height settings-change-user-name btn btn-bottom settings-btn-txt settings-btn-txt" to={"/board/settings/update"}>
				Change username
			</Link>
			<div className="underline settings-line-margin"></div>
			<div className="settings-bottom-container">
				<button className="settings-fixed-height btn settings-btn-txt" onClick={() => setShowQr(!showQr)}>Set 2FA</button>
				<Link className="settings-fixed-height btn settings-disconnect settings-btn-txt" to="/login"
					onClick={() => {
						localStorage.removeItem("access_token");
						localStorage.removeItem("username");
				}}>
					Disconnect
				</Link>
			</div>
			{(showQr && <TwoFactorAuth username={localStorage.getItem("username")}/>)}
			{/*Change avatar button*/}
			{/*separator*/}
			{/*username*/}
			{/*Change username button*/}
			{/*separator*/}
			{/*customization option*/}
			{/*separator*/}
			{/*enable/disable two factor authentification*/}
		</div>
	);
}
