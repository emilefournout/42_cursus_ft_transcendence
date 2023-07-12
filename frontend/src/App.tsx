import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Game } from "./pages/Game/Game";
import { Welcome } from "./pages/Welcome/Welcome";
import { RoomParam } from "./pages/Chat/Room/RoomParam/RoomParam";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </>
  );
}
export default App;
