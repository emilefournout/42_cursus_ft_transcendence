import React from "react";
import "./Welcome.css";
import iconVect from "./change-icon.svg"

export function Welcome() {
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
            <div className="wrapper-img">
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                className="user-avatar"
              />
              <img id="change-img" src={iconVect} />
            </div>
            <input
              id="wp-username-input"
              type="text"
              placeholder="User Name"
              required
            />
            <input id="wp-2fa-input" type="text" placeholder="2FA Code" />
            <button id="wp-submit" className="btn btn-bottom-right">
              Done!
            </button>
          </div>
        </div>
      </div>
  );
}