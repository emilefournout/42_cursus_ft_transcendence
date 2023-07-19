import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Game } from "./pages/Game/Game";
import { Welcome } from "./pages/Welcome/Welcome";
import { ChatPage } from "./pages/Chat/Chat"
import { RoomParam } from "./pages/Chat/Room/RoomParam/RoomParam";
import { NotFound } from "./pages/Error/NotFound";
import { HelmetProvider } from "react-helmet-async";

function App() {
  return (
    <>
    <HelmetProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/game" element={<Game />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </HelmetProvider>
    </>
  );
}
export default App;
