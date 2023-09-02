import React from "react";
import "./Dialog.css";

interface DialogProps {
	dialog: string | undefined;
	setDialog: (dialog: string | undefined) => void;
}

export function Dialog(props: DialogProps) {
	const closeDialog = () => props.setDialog(undefined);
	return (
		<>
			{props.dialog ? (
				<dialog className="dialog-window wrapper-col" open={!!props.dialog}>
					{props.dialog}
					<button onClick={closeDialog}>Close</button>
				</dialog>
			) : (
				<></>
			)}
		</>
	);
}
