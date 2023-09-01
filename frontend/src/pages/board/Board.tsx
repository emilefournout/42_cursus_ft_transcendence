import { Outlet } from "react-router-dom";
import React, { useEffect, useState } from "react";
import SEO from "../../components/Seo";
import { NavBar } from "../../components/nav_bar/NavBar";
export interface User {
  id: number;
  username: string;
  avatar: string;
  status: string;
  wins: number;
  loses: number;
}

export interface BoardContextArgs {
  me: User;
  updateMe: () => void;
}
export const BoardContext = React.createContext<BoardContextArgs | undefined>(
  undefined
);
export function Board() {
  const [myUser, setMyUser] = useState<User | undefined>();

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
        setMyUser(data as User);
      })
      .catch((e) => console.log("Error updating user"));
  }, []);

  useEffect(() => {
    updateMe();
  }, [updateMe]);

  return (
    <>
      <SEO title={"Pong - Home"} description={"Home of the user"} />
      <NavBar />
      {myUser && (
        <BoardContext.Provider
          value={{ me: myUser, updateMe: updateMe } as BoardContextArgs}
        >
          <Outlet />
        </BoardContext.Provider>
      )}
    </>
  );
}
