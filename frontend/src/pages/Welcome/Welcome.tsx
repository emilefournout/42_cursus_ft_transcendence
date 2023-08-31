import React, { useEffect, useState } from "react";
import "./Welcome.css";
import iconVect from "../../common/change-icon.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { Avatar } from "../../components/Avatar";

export function Welcome() {
  const [username, setUsername] = useState("");
  const [image, setImage] = useState<File>();
  const navigate = useNavigate();
  const navigateError = useNavigate();
  // Guest mode for no 42-students
  const [searchParams, setSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    if (searchParams.get("guest")) return;
    if (!Cookies.get("42token") || Cookies.get("42token") == "j:null") {
      Cookies.remove("42token");
      navigateError("/cookieError");
    }
  });

  function register() {
    if (username.length < 5) {
      setErrorMessage("Username must be at least 5 characters long");
      return;
    }
    const token: string | undefined = searchParams.get("guest")
      ? "guest"
      : Cookies.get("42token");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("image", image as File);
    fetch(`${process.env.REACT_APP_BACKEND}/auth/register`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response: Response) => {
        if (response.ok) return response.json();
        else throw new Error("Error registering");
      })
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("username", data.username);
          navigate("/");
        } else throw new Error();
      })
      .catch((error) => console.log(error));
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
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <button
            id="wp-submit"
            className="btn btn-bottom-right wp-responsive-txt"
            onClick={register}
          >
            Done!
          </button>
          {errorMessage}
        </div>
      </div>
    </div>
  );
}
