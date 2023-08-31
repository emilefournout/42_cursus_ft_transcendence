import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { Board } from "./pages/Board/Board";
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
import { CookieError } from "./pages/Error/CookieError";
import { RoomCreate } from "./pages/Chat/Room/RoomCreate/RoomCreate";
import { Room } from "./pages/Chat/Room/Room";
import { UserProfilePage } from "./pages/UserProfile/UserProfilePage";
import { ChangeNamePage } from "./pages/Settings/ChangeNamePage/ChangeNamePage";
import { SettingsHomePage } from "./pages/Settings/SettingsHomePage";
import { Messages } from "./pages/Chat/Room/Messages/Messages";
import { Root } from "./pages/Root/Root";
import { UserProfile } from "./pages/UserProfile/UserProfile/UserProfile";
import { Ranking } from "./pages/UserProfile/UserProfile/Profile/Ranking/Ranking";
import { DeleteRoom } from "./pages/Chat/Room/RoomParam/DeleteRoom";
import { ChangePassword } from "./pages/Chat/Room/RoomParam/ChangePassword";
import { GameCreateGamePage } from "./pages/Game/GameCreateGamePage/GameCreateGamePage";
import { FullAchievements } from "./pages/UserProfile/UserProfile/FullAchievements/FullAchievement";

function App() {
  return (
    <>
      <HelmetProvider>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route path="" element={<Navigate to={"/board"} />} />
            <Route path="login" element={<Login />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="board" element={<Board />}>
              <Route path="" element={<Navigate to={"/board/userAccount"} />} />
              <Route path="game" element={<Game />}>
                <Route path="" element={<GameHomePage />} />
                <Route path="matchmaking" element={<GameMatchmakingPage />} />
                <Route path="newGame" element={<GameCreateGamePage />} />
                <Route path=":id" element={<GamePlayPage />} />
              </Route>
              <Route path="chats" element={<ChatPage />}>
                <Route path="create" element={<RoomCreate />} />
                <Route path="" element={<Room />} />
                <Route path=":id" element={<Room />}>
                  <Route path="" element={<Messages />} />
                  <Route path="param">
                    <Route path="" element={<RoomParam />} />
                    <Route path="delete" element={<DeleteRoom />} />
                    <Route path="changePassword" element={<ChangePassword />} />
                  </Route>
                </Route>
              </Route>
              <Route path="settings" element={<Settings />}>
                <Route path="" element={<SettingsHomePage />} />
                <Route path="update" element={<ChangeNamePage />} />
              </Route>
              <Route path="userAccount" element={<UserProfilePage />}>
                <Route path="achievements" element={<FullAchievements />} />
                <Route path="" element={<UserProfile />} />
                <Route path=":id" element={<UserProfile />} />
                <Route path="ranking" element={<Ranking />} />
              </Route>
            </Route>
            <Route path="cookieError" element={<CookieError />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </>
  );
}
export default App;
