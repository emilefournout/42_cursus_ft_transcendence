import React, { useCallback, useEffect, useState } from "react";
import { Message } from "./Message";
import { useNavigate, useParams } from "react-router-dom";
import "./Messages.css";
import { RoomInput } from "../RoomInput/RoomInput";
import { BoardContext, User } from "../../../Board/Board";
import { ChatSocket } from "../../../../services/socket";

export interface MsgProps {
	messages: Array<Msg>;
}

export interface Msg {
	uuid: string;
	text: string;
	createdAt: string;
	userId: number;
	chatId: number;
}

export function Messages() {
	const [messages, setMessages] = useState<Array<Msg> | undefined>(undefined);

	const chatSocket = ChatSocket.getInstance().socket;
	const { id } = useParams();
	const navigate = useNavigate();
	useEffect(() => {
		chatSocket.emit("join_room", { chatId: id });
		fetch(`${process.env.REACT_APP_BACKEND}/chat/${id}/messages`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => {
				if (!response.ok) throw new Error("conv not found");
				return response.json();
			})
			.then((data) => data as Msg[])
			.then((data) => {
				setMessages(data);
			})
			.catch((error) => {
				setMessages(undefined);
				console.log(error);
			});
		return () => {};
	}, [chatSocket, id, messages, navigate]);

	useEffect(() => {
		if (messages === undefined) return;
		chatSocket.off("receive_message");
		chatSocket.on("receive_message", (data) => {
			if (data.chatId === Number(id)) setMessages((msgs) => [...msgs!, data]);
		});
	}, [chatSocket, id, messages]);

	const boardContext = React.useContext(BoardContext);
	const myUserId = boardContext?.me.id;

	if (messages === undefined)
		return (
			<>
				conv not found
				<button onClick={() => navigate("/board/chats")}>back</button>
			</>
		);
	else if (boardContext === undefined) return <>loading</>;
	else {
		return (
			<>
				<div className="wrapper-msgs">
					<div>
						{messages.map((message: Msg) => {
							const isMyMessage = message.userId === myUserId;
							const msgClasses = isMyMessage
								? "message-content message-content-right"
								: "message-content message-content-left";

							return (
								<Message
									message={message}
									isMyMessage={isMyMessage}
									msgClasses={msgClasses}
									key={message.uuid}
								/>
							);
						})}
					</div>
				</div>
				<RoomInput chatSocket={chatSocket} />
			</>
		);
	}
}
