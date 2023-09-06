import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Dialog } from "./Dialog";
import { devlog, testing } from "../../services/core";

interface DialogContextArgs {
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const DialogContext = React.createContext({} as DialogContextArgs);

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dialog, setDialog] = useState<string | undefined>(undefined);

  useEffect(() => {
    devlog("Dev mode : testing console.log displayed");
    if (location.pathname === "/login" || location.pathname === "/welcome")
      return;
    const jwtToken = localStorage.getItem("access_token");
    try {
      if (!jwtToken) throw new Error("No token found");
      const jwtData = JSON.parse(atob(jwtToken.split(".")[1]));
      const expirationDate: number = jwtData.exp * 1000;
      if (expirationDate < Date.now()) throw new Error("Expired token");
    } catch (error) {
      localStorage.removeItem("access_token");
      setDialog("Please sign in");
      navigate("/login");
    }
  }, [location.pathname, navigate]);
  return (
    <>
      <Dialog dialog={dialog} setDialog={setDialog} />
      <DialogContext.Provider
        value={{ setDialog: setDialog } as DialogContextArgs}
      >
        <Outlet />
      </DialogContext.Provider>
    </>
  );
}
