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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "50%",
        width: "100%",
        gap: "30px",
        padding: "16px",
        left: "0px",
      }}
    >
      <div>Search for a chat room</div>
      <input
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
            <div key={chat.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                }}
              >
                <div>{chat.name}</div>
                <button onClick={() => navigate(`/board/chats/${chat.id}`)}>
                  join
                </button>
              </div>
            </div>
          );
        })}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "10px",
        }}
      >
        <button onClick={() => navigate("/board/chats/add")}>cancel</button>
        <button onClick={() => search_room(searchInput)}>search</button>
      </div>
    </div>
  );
}
