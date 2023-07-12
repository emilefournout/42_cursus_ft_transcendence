import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage/HomePage";
import { Login } from "./pages/Login/Login";
import { Game } from "./pages/Game/Game";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </>
  );
}
export default App;
