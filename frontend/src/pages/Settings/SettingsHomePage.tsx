import React from "react";
import "./SettingsHomePage.css"

import { Link } from "react-router-dom";

import { Avatar } from "../../components/Avatar";
export function SettingsHomePage() {
	return (
		<>
			<Avatar />
			<div className="underline settings-line-margin"></div>
			<div className="settings-user-name">{"@" + localStorage.getItem("username")}</div>
			<Link className="settings-fixed-height settings-change-user-name btn btn-bottom settings-btn-txt settings-btn-txt" to={"/board/settings/update"}>
				Change username
			</Link>
			<div className="underline settings-line-margin"></div>
			<div className="wrapper-row">
				(2FA thing here)
				<Link className="settings-fixed-height btn settings-disconnect settings-btn-txt" to="/login"
					onClick={() => {
						localStorage.removeItem("access_token");
					}}>
					Disconnect
				</Link>
			</div>
			{/*Change avatar button*/}
			{/*separator*/}
			{/*username*/}
			{/*Change username button*/}
			{/*separator*/}
			{/*customization option*/}
			{/*separator*/}
			{/*enable/disable two factor authentification*/}
		</>
	);
}
