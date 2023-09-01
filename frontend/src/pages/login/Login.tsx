import React from "react";
import "./Login.css";
import SEO from "../../components/Seo";

export function Login() {
  return (
    <>
      <SEO
        title="Pong - Login"
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
        onClick={handleLoginWith42}
      >
        Login with 42
      </button>
    </>
  );

  function handleLoginWith42() {
    const jwtToken = localStorage.getItem("access_token");
    if (jwtToken) {
      const jwtData = JSON.parse(atob(jwtToken.split(".")[1]));
      const expirationDate = new Date(jwtData.exp * 1000);
      if (expirationDate > new Date()) {
        window.location.href = "http://localhost:8000/";
      } else {
        localStorage.removeItem("access_token");
        localStorage.removeItem("username");
        redirectTo42Api();
      }
    } else {
      redirectTo42Api();
    }
  }

  function redirectTo42Api() {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${
      process.env.REACT_APP_INTRA_UID
    }&redirect_uri=${encodeURI(
      process.env.REACT_APP_REDIRECT_URI ?? ""
    )}&response_type=code`;
  }
}
