import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInfo, ChatPageContext } from "../../../Chat";
import { PasswordDialog } from "./PasswordDialog";
import { devlog } from "../../../../../services/core";
import { RoomSearchCard } from "./RoomSearchCard";
import { ErrorBody } from "../../param/RoomParam";
import { Dialog } from "../../../../root/Dialog";

export function RoomSearch() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<ChatInfo> | undefined
  >(undefined);
  const chatPageContext = useContext(ChatPageContext);
  const chats = chatPageContext.chats;
  const [showPasswordDialog, setShowPasswordDialog] = useState<
    ChatInfo | undefined
  >(undefined);
  const [showDialog, setShowDialog] = useState<string | undefined>(undefined);
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
        devlog(error);
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
        response.json().then((data: ErrorBody) => {
          if (
            data.message &&
            data.message === "User is banned from this chat"
          ) {
            setShowDialog("You are banned from this chat");
          }
        });
        throw new Error("Error joining room");
      }
      chatPageContext
        .updateChats()
        .catch((error) => {
          devlog(error);
        })
        .then(() => search_room(searchInput));
      navigate(`/board/chats/${chat.id}`);
    });

  const join = (chat: ChatInfo) => {
    if (chat.visibility === "PROTECTED") {
      setShowPasswordDialog(chat);
    } else {
      fetchJoin(chat).catch((error) => {
        devlog(error);
      });
    }
  };

  return (
    <>
      <div className="wrapper-new-room">
        <h2 id="item-margin-top">Search for a chat room</h2>
        <input
          style={{ margin: "8px 0" }}
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value.trim().toLowerCase());
            search_room(e.target.value.trim().toLowerCase());
          }}
          type="text"
          placeholder="room name"
        />
        {searchResults &&
          searchResults.map((chat) => {
            if (chats?.find((c) => c.id === chat.id) !== undefined)
              return <></>;
            return <RoomSearchCard chat={chat} join={join} key={chat.id} />;
          })}
        <Dialog dialog={showDialog} setDialog={setShowDialog} />
        <PasswordDialog
          showDialog={showPasswordDialog}
          setShowDialog={setShowPasswordDialog}
          fetchJoin={fetchJoin}
        />
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
