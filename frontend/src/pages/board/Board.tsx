import { Outlet, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import SEO from "../../components/Seo";
import { NavBar } from "../../components/nav_bar/NavBar";
import { DialogContext } from "../root/Root";

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
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  const navigate = useNavigate()
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
      .catch((e) => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("username")
        setDialog("Received bad response from server, try to login again")
        navigate("/login")
      });
      
  }, [navigate, setDialog]);

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
