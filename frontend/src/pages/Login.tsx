import { Link } from "react-router-dom";
import React from "react";

export function Login() {
  return (
    <>
      <h1>Login</h1>
      <Link to="/home">
        <button>Connect</button>
      </Link>
    </>
  );
}
