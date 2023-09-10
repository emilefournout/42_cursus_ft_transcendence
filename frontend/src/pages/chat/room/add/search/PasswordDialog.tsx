import React, { useState } from "react";
import { ChatInfo } from "../../../Chat";
import { devlog } from "../../../../../services/core";

interface PasswordDialogProps {
	showDialog: ChatInfo | undefined;
	setShowDialog: (dialog: ChatInfo | undefined) => void;
	fetchJoin: (chat: ChatInfo, password?: string) => Promise<void>;
}

export function PasswordDialog(props: PasswordDialogProps) {
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const closeDialog = () => props.setShowDialog(undefined);
	const join = (password: string) => {
		if (password.length === 0) {
			setErrorMessage("Please enter a password");
			return;
		}
		props.fetchJoin(props.showDialog!, password).catch((error) => {
			devlog(error);
			setErrorMessage("Incorrect password");
		});
	};

	return (
		<>
			{props.showDialog ? (
				<dialog className="dialog-window wrapper-col" open={!!props.showDialog}>
					{props.showDialog?.name} is protected, please enter password:
					<input
						value={password}
						type="password"
						placeholder="new password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button onClick={() => join(password)}>Join</button>
					<button onClick={closeDialog}>Close</button>
					{errorMessage}
				</dialog>
			) : (
				<></>
			)}
		</>
	);
}
