import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../../../Chat";

export function RoomSearch() {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");
	const [searchResults, setSearchResults] = useState<
		Array<ChatInfo> | undefined
	>(undefined);
	const chatPageContext = useContext(ChatPageContext);
	const chats = chatPageContext.chats;

	const search_room = (search_input: string) =>
		fetch(`${process.env.REACT_APP_BACKEND}/chat/search/${search_input}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Error searching for room");
				}
				return response.json();
			})
			.then((data) => {
				setSearchResults(data);
			})
			.catch((error) => {
				console.log(error);
			});

	return (
		<div className="wrapper-new-room">
			<h2 id="item-margin-top">Search for a chat room</h2>
			<input
				style={{margin: "8px 0"}}
				value={searchInput}
				onChange={(e) => {
					setSearchInput(e.target.value);
					search_room(e.target.value);
				}}
				type="text"
				placeholder="room name"
			/>
			{searchResults &&
				searchResults.map((chat) => {
					return (
						<div
							key={chat.id}
							className="wrapper-room-search-list"
						>
							<div className="ellipsed-txt">{chat.name}</div>
							<button onClick={() => navigate(`/board/chats/${chat.id}`)}>
								Join
							</button>
						</div>
					);
				})}
			<div id="item-margin-bot" className="wrapper-row wrapper-room-search-list">
				<button onClick={() => navigate("/board/chats/add")}>cancel</button>
				<button onClick={() => search_room(searchInput)}>search</button>
			</div>
		</div>
	);
}
