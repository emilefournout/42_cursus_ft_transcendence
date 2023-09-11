import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BoardContext } from "../../board/Board";
import "./ChangeNamePage.css";

export function ChangeNamePage() {
	const navigate = useNavigate();
	const [newUsername, setNewUsername] = useState("");
	const [confirm, setConfirm] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const boardContext = React.useContext(BoardContext);
	const validateUsername = () => {
		if (confirm.length < 5) {
			setErrorMessage("username must be at least 5 characters long");
		} else if (newUsername !== confirm) {
			setErrorMessage("username and confirmation must match");
		} else {
			fetch(`${process.env.REACT_APP_BACKEND}/user/me`, {
				method: "PATCH",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("access_token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: newUsername,
				}),
			})
				.then((response) => {
					if (response.status === 200) {
						setErrorMessage("username changed");
						boardContext?.updateMe();
					} else if (response.status === 400) {
						response.json().then((data) => {
							setErrorMessage(data.message || " Could not change username");
						});
					} else {
						setErrorMessage("Error while changing username");
					}
				})
				.catch((error) => {
					setErrorMessage("An error occurred while making the request");
				});
		}
		setNewUsername("");
		setConfirm("");
	};
	return (
		<div className="change-user-name-container">
			<input
				id="unc-in1"
				value={newUsername}
				type="text"
				placeholder="new username"
				onChange={(e) => setNewUsername(e.target.value)}
			/>
			<input
				id="unc-in2"
				value={confirm}
				type="text"
				placeholder="confirm new username"
				onChange={(e) => setConfirm(e.target.value)}
				onKeyDown={(e) => {
					e.key === "Enter" && validateUsername();
				}}
			/>
			<div id="unc-msg" className="wrapper-col">
				{errorMessage}
			</div>
			<button
				id="unc-cancel"
				className="btn btn-bottom-left"
				onClick={() => {
					navigate("/board/settings");
				}}
			>
				Cancel
			</button>
			<button
				className="btn btn-bottom-right"
				onClick={() => validateUsername()}
			>
				Change Username
			</button>
		</div>
	);
}
