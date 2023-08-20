import React, { JSX, useEffect, useState } from "react";
import "./ChatLeftBar.css";
import "./Conversations/Conversations.css";
import NewChatIcon from "./NewChatIcon.svg";
import ReloadBlackIcon from "../../../common/reload_black.svg";
import { Link, useNavigate } from "react-router-dom";
import { ChatInfo } from "../Chat";

export interface LeftBarProps {
	chats: Array<ChatInfo>;
	updateChats: () => void;
}

export function LeftBar(props: LeftBarProps) {
	const navigate = useNavigate();

	return (
		<div id="lb-main-wrapper" className="wrapper-col">
			<div id="lb-top-wrapper">
				<span>Chats</span>
				<Link to="/board/chats/create">
					<img className="nav-icons" src={NewChatIcon} />
				</Link>
				<img
					className="nav-icons"
					src={ReloadBlackIcon}
					onClick={props.updateChats}
				/>
			</div>
			{/* <Link to="/chats/room">*/}
			<div id="lb-bot-wrapper">
				{props.chats.length === 0 ? (
					<div>You have no chats</div>
				) : (
					props.chats.map((chat: ChatInfo) => {
						return (
							<div
								className="wrapper-row wrapper-conversation"
								key={chat.id}
								onClick={() => {
									navigate(`/board/chats/${chat.id}`, {
										state: { chat: chat },
									});
								}}
							>
								{chat.name ? chat.name : "No name"}
							</div>
						);
					})
				)}
			</div>
			{/*</Link>*/}
		</div>
	);
}
