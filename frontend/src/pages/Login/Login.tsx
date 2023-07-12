import React from "react";
import "./Login.css";

export function Login() {

  return (
      <>
        <h1 className="txt txt-shadow-top">PONG</h1>
        <div className="underline"></div>
        <h2 className="txt txt-shadow-bot txt-shadow-blu">
          A Transcendence Project for 42
        </h2>
        <button className="btn btn-bottom" onClick={() => {
            window.location.href =`https://api.intra.42.fr/oauth/authorize?client_id=${
              process.env.REACT_APP_INTRA_UID
            }&redirect_uri=${encodeURI(
              process.env.REACT_APP_REDIRECT_URI ?? ""
            )}&response_type=code`}}>
            Login with 42
        </button>
      </>
  );
}
