import React from "react";
import LockChatIcon from "./LockChatIcon.svg";
import "./Conversations.css"

export function Conversations() {
	return (
		<div className="wrapper-conversation wrapper-row"> {/* An id called "selected-conversation" exists and should be given to the currently selected conversation only. */}
			Priv 1
{/* The presence of the lock img depends on the conversation privacity conf. */}
			<img className="conversation-icons" src={LockChatIcon}></img>
		</div>
	);
}
