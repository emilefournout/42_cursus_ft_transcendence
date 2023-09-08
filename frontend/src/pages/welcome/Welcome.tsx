import React from "react";
import "./Welcome.css";
import SEO from "../../components/Seo";

export function Welcome() {
  return (
    <>
      <SEO
        title="Pong"
        description="Log in now and start a pong games or chat with your friends."
      />
      <h1 id="login-h1" className="txt txt-shadow-top">
        PONG
      </h1>
      <div className="underline"></div>
      <h2 id="login-h2" className="txt txt-shadow-bot txt-shadow-blu">
        A Transcendence Project for 42
      </h2>

      <button
        className="btn btn-bottom btn-fixed-height responsive-button"
        onClick={redirectTo42Api}
      >
        Login with 42
      </button>
    </>
  );


  function redirectTo42Api() {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
      process.env.REACT_APP_INTRA_UID
    }&redirect_uri=${encodeURI(
      process.env.REACT_APP_REDIRECT_URI ?? ""
    )}&response_type=code`;
  }
}
