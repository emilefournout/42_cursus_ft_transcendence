import React, { useContext, useEffect } from "react";
import "./friend_card/FriendCard.css";
import ingameIcon from "./friend_card/accepted_friend_card/ingameIcon.svg";
import { BoardContext, GameInfo } from "../../../board/Board";
import { useNavigate } from "react-router-dom";

export enum UserStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
  InGame = "INGAME",
}

interface Props {
  status: string;
  friendId: number;
}

export function FriendStatus(props: Props) {
  const boardContext = useContext(BoardContext);

  const navigate = useNavigate();

  const currentGame: GameInfo | undefined = boardContext?.currentGames.find(
    (game) =>
      game.user1_id === props.friendId || game.user2_id === props.friendId
  );

  if (boardContext === undefined) {
    return <></>;
  } else if (currentGame !== undefined) {
    return (
      <div
        className="friend-card-status friend-card-subtitle"
        onClick={() => {
          navigate("/board/game/" + currentGame!.uuid);
        }}
      >
        <div
          className="friend-card-status-marker"
          style={{ background: "green" }}
        ></div>
        Watch Game
      </div>
    );
  } else if (props.status === UserStatus.Online) {
    return (
      <div className="friend-card-status friend-card-subtitle">
        <div
          className="friend-card-status-marker"
          style={{ background: "var(--Mooned-Teal)" }}
        ></div>
        Online
      </div>
    );
  } else if (props.status === UserStatus.Offline) {
    return (
      <div className="friend-card-status friend-card-subtitle">
        <div
          className="friend-card-status-marker"
          style={{ background: "var(--Crisped-Orange)" }}
        ></div>
        Offline
      </div>
    );
  } else {
    return <></>;
  }
}
