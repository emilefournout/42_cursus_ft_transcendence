import React from "react";
import { NavBar } from "../../components/NavBar/NavBar";
import { Link } from "react-router-dom";
export function Settings() {
  return (
    <>
      settings
      <Link to="/login">
        <button
          className="btn btn-fixed-height"
          onClick={() => localStorage.removeItem("access_token")}
        >
          Disconnect
        </button>
      </Link>
      {/*Avatar*/}
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
