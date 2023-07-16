import React, { useState } from "react";
import "./Welcome.css";
import iconVect from "./change-icon.svg"

export function Welcome() {
  const [username, setUsername] = useState('')
  const [image, setImage] = useState<File>()
  const [code2fa, setCode2fa] = useState('')

  function saveImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files?.length) {
      // setImage(URL.createObjectURL(event.target.files[0]))
      setImage(event.target.files[0])
    }
  }

  function register() {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('image', image as File)
    formData.append('code2fa', code2fa)
    fetch(`${process.env.REACT_APP_BACKEND}/auth/login`, {
      method: 'POST',
      body: formData,
    })
      .then((response: Response) => {
        console.log(response.status) // TODO
      })
      .catch(error => console.log(error))
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
            <div className="wrapper-img">
              <label htmlFor="upload">
                {/* The src should be a random avatar on first login and the user's chosen one on successive ones. */}
                <img
                  src="https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                  className="user-avatar"
                />
                <img id="change-img" src="./change-icon.svg" />
              </label>
            </div>
            <input
              type="file"
              id="upload"
              name="avatar"
              style={{display: "none"}}
              onChange={saveImage}
            />
            <input
              id="wp-username-input"
              className="wp-responsive-txt"
              type="text"
              placeholder="User Name"
              onChange={event => setUsername(event.target.value)}
              required
            />
            <input id="wp-2fa-input" className="wp-responsive-txt" type="text" placeholder="2FA Code"
              onChange={event => setCode2fa(event.target.value)}
            />
            <button id="wp-submit" className="btn btn-bottom-right wp-responsive-txt"
              onClick={register}
            >
              Done!
            </button>
          </div>
        </div>
      </div>
  );
}