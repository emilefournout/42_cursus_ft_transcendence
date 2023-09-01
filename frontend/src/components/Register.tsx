import React, { useContext, useState } from "react";
import { Dialog } from "./Dialog";
import { set } from "js-cookie";
import { DialogContext } from "../pages/Root/Root";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
  function register() {
    fetch(`${process.env.REACT_APP_BACKEND}/user`, {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        email,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response: Response) => {
        if (!response.ok) throw new Error("Error creating user");
        if (response.status === 201) {
          setDialog("User created correctly");
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setDialog(data.message);
        }
      })
      .catch((error) => console.log("Error on registration a user"));
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <input
          type="text"
          placeholder="Email"
          onChange={(event) => setEmail(event.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>
    </>
  );
}

export default Register;
