import React, { useState } from "react";
import { Register } from "./Register";

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function login() {
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response: Response) => response.json())
      .then((data) => {
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token)
          window.location.href='/home'
        } else {
          window.alert('Cannot login')
        }
      })
      .catch(error => console.log(error))
  }

  return (
    <>
      <h1>Login</h1>
      <Register />
      <div>
        <input
          type="text"
          placeholder="Username"
          onChange={event => setUsername(event.target.value)}
        />
        <input
          type="text"
          placeholder="Password"
          onChange={event => setPassword(event.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    </>
  );
}
