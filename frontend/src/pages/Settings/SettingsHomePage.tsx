import React from "react";

import { Link } from "react-router-dom";

import { Avatar } from "../../components/Avatar";
export function SettingsHomePage() {
  return (
    <>
      settings
      <Avatar />
      <div>{localStorage.getItem("username")}</div>
      <Link to={"/board/settings/update"}>
        <button>Change username</button>
      </Link>
      <Link to="/login">
        <button
          className="btn btn-fixed-height"
          onClick={() => {
            localStorage.removeItem("access_token");
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
