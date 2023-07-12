import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  function register() {
    fetch(`${process.env.REACT_APP_BACKEND}/user`, {
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
      .then((response: Response) => {
        if (response.status === 201) {
          window.alert('User created correctly')
        }
        return response.json()
      })
      .then(data => {
        if (data.error) {
          window.alert(data.message)
        }
      })
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

export default Register