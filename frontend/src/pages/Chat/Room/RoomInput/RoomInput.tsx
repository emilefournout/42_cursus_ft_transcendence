import React, { useContext, useState } from "react";
import "./RoomInput.css";
import SendIcon from "./SendIcon.svg";
import { useParams } from "react-router-dom";
import { BoardContext } from "../../../Board/Board";
import { Socket } from "socket.io-client";
import { DialogContext } from "../../../Root/Root";

interface InputProps {
  chatSocket: Socket;
}

export function RoomInput({ chatSocket }: InputProps) {
  const [input, setInput] = useState("");
  const { id } = useParams();
  const boardContext = useContext(BoardContext);
  const userId = boardContext?.me.id;
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const sendMessage = () => {
    if (input.length === 0) {
      setDialog("Please enter a message.");
    } else if (!userId) {
      setDialog("no user id");
    } else if (!id) {
      setDialog("no chat id");
    }

    const data = {
      chatId: id,
      userId,
      text: input,
    };
    chatSocket.emit("send_message", data);
    setInput("");
  };
  return (
    <>
      <div className="wrapper-room-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <div>
          <img
            className="nav-icons"
            src={SendIcon}
            onClick={sendMessage}
            alt={"Send message"}
          ></img>
        </div>
      </div>
    </>
  );
}
