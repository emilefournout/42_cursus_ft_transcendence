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
          </div>
        </div>
        <div className="underline wp-underline"></div>
        <div className="window-body-centered">
          <div className="wrapper-welcome-grid">
            <div className="wrapper-img">
              {/* The src should be a random avatar on first login and the user's chosen one on successive ones. */}
              <img
                src="https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                className="user-avatar"
                alt="Avatar of the user"
              />
              <img id="change-img" src={iconVect} alt="Selecting the avatar icon"/>
            </div>
            <input
              id="wp-username-input"
              className="wp-responsive-txt"
              type="text"
              placeholder="User Name"
              required
            />
            <input id="wp-2fa-input" className="wp-responsive-txt" type="text" placeholder="2FA Code" />
            <button id="wp-submit" className="btn btn-bottom-right wp-responsive-txt">
              Done!
            </button>
          </div>
        </div>
      </div>
  );
}