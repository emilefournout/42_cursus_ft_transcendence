import React, { useContext, useState } from "react";
import "./RoomInput.css";
import SendIcon from "./SendIcon.svg";
import { useParams } from "react-router-dom";
import { BoardContext } from "../../../Board/Board";

export function RoomInput() {
  const [input, setInput] = useState("");
  const { id } = useParams();
  const boardContext = useContext(BoardContext);
  const userId = boardContext?.me.id;
  const sendMessage = () => {
    if (input.length === 0) {
      alert("Please enter a message.");
      return;
    } else if (!userId) {
      alert("no user id");
      return;
    } else if (!id) {
      alert("no chat id");
      return;
    }

    fetch(`${process.env.REACT_APP_BACKEND}/chat/${id}/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: input,
        userId: userId,
      }),
    })
      .then((response) => {
        console.log("response ->", response);
      })
      .catch((error) => {
        console.log("error ->", error);
      });
  };
  return (
    <div className="wrapper-room-input">
      <input onChange={(e) => setInput(e.target.value)}></input>
      <div>
        <img
          className="nav-icons"
          src={SendIcon}
          onClick={sendMessage}
          alt={"Send message"}
        ></img>
      </div>
    </div>
  );
}
