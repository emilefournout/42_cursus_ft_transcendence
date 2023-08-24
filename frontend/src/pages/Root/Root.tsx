import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Dialog } from "../../components/Dialog";

export function Root() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dialog, setDialog] = useState<string | undefined>(undefined);
  useEffect(() => {
    console.log("useEffect");
    if (location.pathname === "/login" || location.pathname === "/welcome")
      return;
    const jwtToken = localStorage.getItem("access_token");
    if (jwtToken) {
      const jwtData = JSON.parse(atob(jwtToken.split(".")[1]));
      const expirationDate = new Date(jwtData.exp * 1000);
      if (expirationDate < new Date(Date.now())) {
        navigate("/login");
        localStorage.removeItem("access_token");
        setDialog("Your session has expired, please sign in again");
        return;
      }
    } else {
      navigate("/login");
      setDialog("Sign in to access this page");
      return;
    }
  }, [location.pathname, navigate]);
  return (
    <>
      <Dialog dialog={dialog} setDialog={setDialog} />

      <Outlet />
    </>
  );
}
