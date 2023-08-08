import React from "react";
import { NavBar } from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
import { Avatar } from "./Avatar";
export function Settings() {
  return (
    <>
      settings
      <Avatar />
      <Link to="/login">
        <button
          className="btn btn-fixed-height"
          onClick={() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user_id");
          }}
        >
          Disconnect
        </button>
      </Link>
      {/*Change avatar button*/}
      {/*separator*/}
      {/*username*/}
      {/*Change username button*/}
      {/*separator*/}
      {/*customization option*/}
      {/*separator*/}
      {/*enable/disable two factor authentification*/}
    </>
  );
}
