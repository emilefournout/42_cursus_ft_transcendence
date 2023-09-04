import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../../../Chat";
import { PasswordDialog } from "./PasswordDialog";
import { testing } from "../../../../../services/core";

export function RoomSearch() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<ChatInfo> | undefined
  >(undefined);
  const chatPageContext = useContext(ChatPageContext);
  const chats = chatPageContext.chats;
  const [showDialog, setShowDialog] = useState<ChatInfo | undefined>(undefined);
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
        if (testing) console.log(error);
      });

  const fetchJoin = (chat: ChatInfo, password?: string) =>
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${chat.id}/join`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      ...(password && { body: JSON.stringify({ password: password }) }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Error joining room");
      }
      chatPageContext
        .updateChat()
        .catch((error) => {
          if (testing) console.log(error);
        })
        .then(() => search_room(searchInput));
      navigate(`/board/chats/${chat.id}`);
    });

  const join = (chat: ChatInfo) => {
    if (chat.visibility === "PROTECTED") {
      setShowDialog(chat);
    } else {
      fetchJoin(chat).catch((error) => {
        if (testing) console.log(error);
      });
    }
  };

  return (
    <>
      <PasswordDialog
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        fetchJoin={fetchJoin}
      />
      <div className="wrapper-new-room">
        <h2 id="item-margin-top">Search for a chat room</h2>
        <input
          style={{ margin: "8px 0" }}
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
            if (chats?.find((c) => c.id === chat.id) !== undefined)
              return <></>;
            return (
              <div key={chat.id} className="wrapper-room-search-list">
                <div className="ellipsed-txt">{chat.name}</div>
                <button onClick={() => join(chat)}>Join</button>
              </div>
            );
          })}
        <div
          id="item-margin-bot"
          className="wrapper-row wrapper-room-search-list"
        >
          <button onClick={() => navigate("/board/chats/add")}>cancel</button>
          <button onClick={() => search_room(searchInput)}>search</button>
        </div>
      </div>
    </>
  );
}
