import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export function ChangeNamePage() {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const validateUsername = () => {
    if (confirm.length < 5) {
      setErrorMessage("username must be at least 5 characters long");
    } else if (newUsername !== confirm) {
      setErrorMessage("username and confirmation must match");
    } else {
      fetch("http://localhost:3000/user/me", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
        }),
      }).then((response) => {
        if (response.status === 200) {
          localStorage.setItem("username", newUsername);
          setErrorMessage("username changed");
        } else {
          setErrorMessage("Error while changing username");
        }
      });
    }
    setNewUsername("");
    setConfirm("");
  };
  return (
    <>
      <div id="wrapper-change-username">
        <input
          value={newUsername}
          type="text"
          placeholder="set new username"
          onChange={(e) => setNewUsername(e.target.value)}
        />
        <input
          value={confirm}
          type="text"
          placeholder="confirm new username"
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>
      <div id="txt-password-strength">{errorMessage}</div>
      <button
        onClick={() => {
          navigate("/settings");
        }}
      >
        cancel
      </button>
      <button onClick={() => validateUsername()}>change username</button>
    </>
  );
}
