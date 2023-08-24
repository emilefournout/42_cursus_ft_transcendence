import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

export function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/welcome")
      return;
    const jwtToken = localStorage.getItem("access_token");
    if (jwtToken) {
      const jwtData = JSON.parse(atob(jwtToken.split(".")[1]));
      const expirationDate = new Date(jwtData.exp * 1000);
      if (expirationDate < new Date(Date.now())) {
        alert("Your token has expired");
        localStorage.removeItem("access_token");
        navigate("/login");
        return;
      }
    } else {
      alert("No token available");
      navigate("/login");
      return;
    }
  });
  return (
    <>
      <Outlet />
    </>
  );
}
