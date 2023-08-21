import React, { JSX, useEffect, useState } from "react";
import "./ChatLeftBar.css";
import "./Conversations/Conversations.css";
import NewChatIcon from "./NewChatIcon.svg";
import ReloadBlackIcon from "../../../common/reload_black.svg";
import NoMsgsImg from "./NoMsgs.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChatInfo } from "../Chat";
import { ChatPageContext } from "../Chat";

export interface LeftBarProps {
	chats: Array<ChatInfo>;
}

export function LeftBar(props: LeftBarProps) {
	const navigate = useNavigate();
	const { id } = useParams();
	const chatPageContext = React.useContext(ChatPageContext);

	const handleClick = (chat: ChatInfo) => {
		navigate(`/board/chats/${chat.id}`, {
			state: { chat: chat },
		});
	};

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
					onClick={chatPageContext.updateChat}
				/>
			</div>
			{/* <Link to="/chats/room">*/}
			<div id="lb-bot-wrapper">
				{props.chats.length === 0 ? (
					<div id="chat-no-messages">
						No messages?
						<img src={NoMsgsImg}></img>
					</div>
				) : (
					props.chats.map((chat: ChatInfo) => {
						return (
							<div
								id={
									id && chat.id === parseInt(id) ? "selected-conversation" : ""
								}
								className="wrapper-row wrapper-conversation"
								key={chat.id}
								onClick={() => handleClick(chat)}
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
