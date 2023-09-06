import { Outlet, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import SEO from "../../components/Seo";
import { NavBar } from "../../components/nav_bar/NavBar";
import { DialogContext } from "../root/Root";
import { UserSocket } from "../../services/socket";
import { Socket } from "socket.io-client";
import { devlog, testing } from "../../services/core";

export interface GameInfo {
  user1_id: number;
  user2_id: number;
  uuid: string;
}
export interface User {
  id: number;
  username: string;
  avatar: string;
  status: string;
  wins: number;
  loses: number;
  socket: Socket;
}

export interface BoardContextArgs {
  me: User;
  updateMe: () => void;
  currentGames: Array<GameInfo>;
  updateWatchGame: () => void;
}
export const BoardContext = React.createContext<BoardContextArgs | undefined>(
  undefined
);
export function Board() {
  const [myUser, setMyUser] = useState<User | undefined>();
  const [currentGames, setCurrentGames] = useState<Array<GameInfo>>([]);
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const navigate = useNavigate();
  const updateMe = React.useCallback(async () => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error getting user info");
        return response.json();
      })
      .then((data) => {
        data.socket = UserSocket.getInstance();
        setMyUser(data as User);
      })
      .catch((e) => {
        localStorage.removeItem("access_token");
        setDialog("Received bad response from server, try to login again");
        navigate("/login");
      });
  }, [navigate, setDialog]);

  const getGameInfo = React.useCallback(
    async (uuid: string) =>
      fetch(`${process.env.REACT_APP_BACKEND}/game/info/${uuid}`, {
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
          return { ...data, uuid: uuid };
        }),
    []
  );

  const updateWatchGame = React.useCallback(
    async () =>
      fetch(`${process.env.REACT_APP_BACKEND}/game/active-plays`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error getting active plays");
          }
          return response.json();
        })
        .then((data: Array<string>) =>
          Promise.all(data.map((uuid) => getGameInfo(uuid)))
        )
        .then((data: Array<GameInfo>) => {
          setCurrentGames(data ?? []);
        })
        .catch((error) => {
          devlog(error);
        }),
    [getGameInfo, setCurrentGames]
  );

  useEffect(() => {
    updateMe();
    updateWatchGame();
  }, [updateMe, updateWatchGame]);

  return (
    <>
      <SEO title={"Pong - Home"} description={"Home of the user"} />
      <NavBar />
      {myUser && (
        <BoardContext.Provider
          value={
            {
              me: myUser,
              updateMe: updateMe,
              updateWatchGame: updateWatchGame,
              currentGames: currentGames,
            } as BoardContextArgs
          }
        >
          <Outlet />
        </BoardContext.Provider>
      )}
    </>
  );
}
