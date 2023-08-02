import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Login/Login";
import { Welcome } from "./pages/Welcome/Welcome";
import { ChatPage } from "./pages/Chat/Chat";
import { RoomParam } from "./pages/Chat/Room/RoomParam/RoomParam";
import { NotFound } from "./pages/Error/NotFound";
import { HelmetProvider } from "react-helmet-async";
import { Settings } from "./pages/Settings/Settings";
import { GameHomePage } from "./pages/Game/GameHomePage/GameHomePage";
import { GameMatchmakingPage } from "./pages/Game/GameMatchmakingPage/GameMatchmakingPage";
import { GamePlayPage } from "./pages/Game/GamePlayPage/GamePlayPage";
import { Game } from "./pages/Game/Game";
import { RoomCreate } from "./pages/Chat/Room/RoomCreate/RoomCreate";
import { Room } from "./pages/Chat/Room/Room";
import { NavBar } from "./components/NavBar/NavBar";

function App() {
  const navigate = useNavigate();
  const redirection = (event: StorageEvent) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    redirection({} as StorageEvent);
    window.addEventListener("storage", redirection);
    return () => {
      window.removeEventListener("storage", redirection);
    };
  }, [redirection]);

  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/" element={<NavBar />}>
            <Route path="home" element={<Home />} />
            <Route path="game" element={<Game />}>
              <Route path="" element={<GameHomePage />} />
              <Route path=":id" element={<GamePlayPage />} />
              <Route path="matchmaking" element={<GameMatchmakingPage />} />
            </Route>
            <Route path="chats" element={<ChatPage />}>
              <Route path="create" element={<RoomCreate />} />
              {/*<Route path=":id" element={<Room />} />*/}
              {/*Temp Route for coding ->*/}
              <Route path="room" element={<Room />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HelmetProvider>
    </>
  );
}
export default App;
