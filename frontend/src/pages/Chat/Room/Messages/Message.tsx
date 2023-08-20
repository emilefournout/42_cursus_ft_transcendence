import React from "react";
import { Msg } from "./Messages";

interface MessageProps {
	message: Msg;
	isMyMessage: boolean;
	msgClasses: string;
	key: string;
}

export function Message(props: MessageProps) {
	const date = new Date(props.message.createdAt).toLocaleString().replace(", ", "\n");
	return (
		<>{
			props.isMyMessage ? (
				<div className="message-container">
					<div className="wrapper-col message-date-right">
						{date}
					</div>
					<div className={props.msgClasses}>
						{props.message.text}
					</div>
				</div>
			) : (
				<div className="message-container">
					<div className={props.msgClasses}>
						{props.message.text}
					</div>
					<div className="wrapper-col message-date-left">
						{date}
					</div>
				</div>
			)
		}</>
	);
}
