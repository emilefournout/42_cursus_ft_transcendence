import React, { useEffect, useState } from "react";
import { GameInfo, User } from "../../../board/Board";
import { useNavigate } from "react-router-dom";
import { devlog } from "../../../../services/core";

interface WatchingGameCardProps {
  uuid: string;
  key: string;
}

export function WatchingGameCard(props: WatchingGameCardProps) {
  const [username_1, setUsername_1] = useState<string | undefined>(undefined);
  const [username_2, setUsername_2] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const fetch_username = (id: number) =>
    fetch(`${process.env.REACT_APP_BACKEND}/user/info/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting user info");
        }
        return response.json();
      })
      .then((data: User) => data.username);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/game/info/${props.uuid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting game info");
        }
        return response.json();
      })
      .then((data: GameInfo) => {
        fetch_username(data.user1_id)
          .then((username) => setUsername_1(username))
          .then(() => fetch_username(data.user2_id))
          .then((username) => setUsername_2(username))
          .catch((error) => {
            devlog(error);
          });
      })
      .catch((error) => {
        devlog(error);
      });
  }, [props.uuid]);

  if (username_1 === undefined || username_2 === undefined) {
    return <></>;
  }

  return (
    <div
      className="ongoing-game-card columns-txt"
      onClick={() => navigate(props.uuid)}
    >
      <div className="ellipsed-txt">{username_1}</div>
      vs
      <div className="ellipsed-txt">{username_2}</div>
    </div>
  );
}
