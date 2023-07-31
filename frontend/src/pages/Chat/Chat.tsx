import React, { JSX, useState } from "react";
import Chat from "../../components/Chat";
import { NavBar } from "../../components/NavBar/NavBar";
import { LeftBar } from "./ChatLeftBar/ChatLeftBar";
import SEO from "../../components/Seo";
import { RoomCreate } from "./Room/RoomCreate/RoomCreate";
import "./Chat.css"

export function ChatPage() {
  const [board, setBoard] = useState(() => <RoomCreate />);

  const changeBoard = (board: JSX.Element) => {
    setBoard(board);
  };
	return (
		<>
			<SEO
				title="Pong - Chat"
				description="Start a conversation now with a friends or join a channel."
			/>
			<NavBar />
			<div id="chatpage-container">
				<LeftBar callback={changeBoard} />
				{board}
			</div>
		</>
	);
}
