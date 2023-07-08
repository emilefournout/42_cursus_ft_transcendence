import React, { useState } from "react";

export function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  function register() {
    fetch('http://localhost:3000/user', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        email,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response: Response) => console.log(response.status))
      .catch(error => console.log(error))
  }

  return (
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
      <input
        type="text"
        placeholder="Email"
        onChange={event => setEmail(event.target.value)}
      />
      <button onClick={register}>Register</button>
    </div>
  )
}