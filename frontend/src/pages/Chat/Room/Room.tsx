import React, { ContextType, useEffect, useState } from "react";
import { RoomToolBar } from "./RoomToolBar/RoomToolBar";
import "./Room.css";
import {
	Navigate,
	Outlet,
	useLocation,
	useNavigate,
	useOutletContext,
	useParams,
} from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../Chat";
import NoMsgsImg from "../ChatLeftBar/NoMsgs.png";

export function Room() {
	const location = useLocation();
	const [chats]: [Array<ChatInfo> | undefined] = useOutletContext();
	const { id } = useParams();
	const [chat, setChat] = useState<ChatInfo | undefined>(undefined);

	useEffect(() => {
		if (chats === undefined || id === undefined) return;
		let chat: ChatInfo | undefined;
		if (location.state && location.state.chat) chat = location.state.chat;
		else chat = chats.find((chat: ChatInfo) => chat.id === parseInt(id));
		if (!chat) return;
		console.log("chat: ", chat);
		setChat(chat);
	}, [chats, id, location.state]);

	if (chats === undefined) return <></>;
	else if (location.pathname === "/board/chats" && chats.length === 0) {
		return (
			<div id="chat-no-messages">
				No messages?
				<img src={NoMsgsImg}></img>
			</div>
		);
	} else if (location.pathname === "/board/chats") {
		return <Navigate to={`/board/chats/${chats[0].id}`} />;
	} else
		return (
			<div className="wrapper-col wrapper-room">
				<RoomToolBar chat={chat} />
				<Outlet context={chat} />
			</div>
		);
}
