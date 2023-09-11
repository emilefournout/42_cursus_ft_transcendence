import React, { useContext, useState } from "react";
import "./RoomInput.css";
import SendIcon from "./SendIcon.svg";
import { useParams } from "react-router-dom";
import { BoardContext } from "../../../board/Board";
import { Socket } from "socket.io-client";

interface InputProps {
  chatSocket: Socket;
}

export function RoomInput({ chatSocket }: InputProps) {
  const [input, setInput] = useState("");
  const [muted, setMuted] = useState<boolean>(false);
  const { id } = useParams();
  const boardContext = useContext(BoardContext);
  const userId = boardContext?.me.id;

  const isWhiteSpaceString = (str: string): boolean => {
    return str.trim().length === 0;
  };
  const sendMessage = () => {
    if (isWhiteSpaceString(input) || !userId || !id) {
      return;
    }
    const data = {
      chatId: Number(id),
      text: input,
    };
    chatSocket.emit("send_message", data, (response: any) => {
      if (response === "ko") setMuted(true);
      else setMuted(false);
    });
    setInput("");
  };
  return (
    <>
      <div className="wrapper-room-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={muted === true ? "MUTED" : ""}
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
