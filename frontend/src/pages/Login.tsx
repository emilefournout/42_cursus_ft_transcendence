import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Register } from "./Register";

export function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [userid, setUserid] = useState("")
  // const [user, setUser] = useState("")

  // function getUser() {
  //   fetch(`http://localhost:3000/user/${userid}`)
  //     .then((response: Response) => response.json())
  //     .then((data) => {
  //       console.log(data)
  //       setUser(data.username)
  //     })
  //     .catch(error => console.log(error))
  // }

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
        console.log(data)
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
      {/* <input
        type="text"
        placeholder="User id"
        onChange={event => setUserid(event.target.value)}
      />
      <button onClick={getUser}>Get user</button>
      <p>Username: {user}</p> */}
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
      <Link to="/home">
        <button>Connect</button>
      </Link>
    </>
  );
}
