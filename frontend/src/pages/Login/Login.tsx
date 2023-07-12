import React, { useState } from "react";
import Register from "../../components/Register";
import TwoFactorAuth from "../../components/TwoFactorAuth";
import "./Login.css";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);

  function login() {
    fetch(`${process.env.REACT_APP_BACKEND}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          window.location.href = "/home";
        } else {
          window.alert("Cannot login");
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <>
      <div className="Login">
        <h1 className="txt txt-shadow-top">PONG</h1>
        <div className="underline"></div>
        <h2 className="txt txt-shadow-bot txt-shadow-blu">
          A Transcendence Project for 42
        </h2>
        <div>
          <a
            href={`https://api.intra.42.fr/oauth/authorize?client_id=${
              process.env.REACT_APP_INTRA_UID
            }&redirect_uri=${encodeURI(
              process.env.REACT_APP_REDIRECT_URI ?? ""
            )}&response_type=code`}
          >
            Login with 42
          </a>
        </div>
      </div>

      {/*<button onClick={() => setShow2FA(!show2FA)}>
        Two Factor Authentication
      </button>
      <br></br>
      {show2FA && <TwoFactorAuth username={username} />}*/}
    </>
  );
}
