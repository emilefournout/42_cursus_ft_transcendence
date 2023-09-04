import React, { useEffect, useState } from "react";
import { UserInfo } from "os";
import { User } from "../../../board/Board";

interface WatchingGameCardProps {
  key: string;
}
interface GameInfo {
  user1_id: number;
  user2_id: number;
}
export function WatchingGameCard(props: WatchingGameCardProps) {
  const [username_1, setUsername_1] = useState<string | undefined>(undefined);
  const [username_2, setUsername_2] = useState<string | undefined>(undefined);

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
    fetch(`${process.env.REACT_APP_BACKEND}/game/info/${props.key}`, {
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
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [props.key]);

  if (username_1 === undefined || username_2 === undefined) {
    return <></>;
  }
  return (
    <div>
      <div>
        {username_1} vs {username_2}
      </div>
      <div>Watch Game</div>
    </div>
  );
}
