import React, { useEffect, useRef, useState } from "react";
import "./Login.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { devlog } from "../../services/core";

export function Login() {
  const [username, setUsername] = useState("");
  const [code2fa, setCode2fa] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const loadingLogin = useRef(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  // Guest mode for no 42-students
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("guest")) return;
    if (!Cookies.get("42token") || Cookies.get("42token") === "j:null") {
      Cookies.remove("42token");
      navigate("/cookie-error");
    }
    const username: string | undefined = Cookies.get("username");
    if (username) {
      loadingLogin.current = true;
      callLogin(username);
    } else if (!loadingLogin.current) {
      navigate("/welcome");
    }
  });

  function callLogin(username: string) {
    Cookies.remove("username");
    register(username);
  }

  function register(user_name = username) {
    if (user_name.length < 5) {
      setErrorMessage("Username must be at least 5 characters long");
      return;
    }
    const token: string | undefined = searchParams.get("guest")
      ? "guest"
      : Cookies.get("42token");

    const formData = new FormData();
    formData.append("username", user_name);
    formData.append("code2fa", code2fa);

    fetch(`${process.env.REACT_APP_BACKEND}/auth/register`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: Response) => {
        if (response.ok) return response.json();
        else {
          throw new Error("Error login in");
        }
      })
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          loadingLogin.current = false;
          navigate("/");
        } else {
          setUsername(data.username);
          setShow2fa(true);
        }
      })
      .catch((error) => {
        setErrorMessage("bad 2fa code");
        devlog(error);
      });
  }

  return (
    <div className="window-module">
      <div className="window-top-bar">
        <div className="window-title">Login</div>
        <div className="wrapper-col window-overtext">
          <span className="txt txt-shadow-top">Wait a moment for login</span>
        </div>
      </div>
      {show2fa && (
        <div className="window-body-centered">
          <input
            id="wp-2fa"
            className="wp-responsive-txt"
            type="text"
            placeholder="2FA Code"
            onChange={(event) => setCode2fa(event.target.value)}
            onKeyDown={(event) => {
              event.key === "Enter" && register();
            }}
          />
          <button
            id={show2fa ? "wp-submit-2fa" : "wp-submit-no-2fa"}
            className="btn btn-bottom-right wp-responsive-txt"
            onClick={() => register()}
          >
            Done!
          </button>
          <div className="wp-error-msg wp-responsive-txt">{errorMessage}</div>
        </div>
      )}
    </div>
  );
}
