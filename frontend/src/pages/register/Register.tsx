import React, { useEffect, useState } from "react";
import "./Register.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Avatar } from "../../components/Avatar";
import { devlog } from "../../services/core";

export function Register() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File>();
  const [code2fa, setCode2fa] = useState("");
  const [show2fa, setShow2fa] = useState(false);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  // Guest mode for no 42-students
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("guest")) return;
    if (Cookies.get("username")) callRegister(Cookies.get("username"));
    if (!Cookies.get("42token") || Cookies.get("42token") === "j:null") {
      Cookies.remove("42token");
      navigate("/cookie-error");
    }
  });

  function callRegister(user_name: string | undefined) {
    Cookies.remove("username");
    register(user_name);
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
    formData.append("image", image as File);
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
          throw new Error("Error registering");
        }
      })
      .then((data) => {
        //alert(data?.access_token);
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          navigate("/");
        } else {
          setUsername(data.username);
          setShow2fa(true);
        }
      })
      .catch((error) => {
        //alert(error);
        setErrorMessage("bad 2fa code");
        devlog(error);
      });
  }

  return (
    <div className="window-module">
      <div className="window-top-bar">
        <div className="window-title">Welcome</div>
        <div className="wrapper-col window-overtext">
          <span className="txt txt-shadow-top">
            A bit of setup before we begin:
          </span>
          <div className="underline wp-underline"></div>
        </div>
      </div>
      <div className="window-body-centered">
        <div className="wrapper-welcome-grid">
          <Avatar upload={true} download={false} setImg={setImage} />
          <input
            id="wp-username-input"
            className="wp-responsive-txt"
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={(event) => {
              event.key === "Enter" && register();
            }}
            required
          />
          {show2fa && (
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
          )}
          <button
            id={show2fa ? "wp-submit-2fa" : "wp-submit-no-2fa"}
            className="btn btn-bottom-right wp-responsive-txt"
            onClick={() => register()}
          >
            Done!
          </button>
          <div className="wp-error-msg wp-responsive-txt">{errorMessage}</div>
        </div>
      </div>
    </div>
  );
}
