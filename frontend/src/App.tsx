import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./App.css";
import { Board } from "./pages/board/Board";
import { Login } from "./pages/login/Login";
import { Welcome } from "./pages/welcome/Welcome";
import { ChatPage } from "./pages/chat/Chat";
import { RoomParam } from "./pages/chat/room/param/RoomParam";
import { NotFound } from "./pages/error/NotFound";
import { HelmetProvider } from "react-helmet-async";
import { Settings } from "./pages/settings/Settings";
import { GameHomePage } from "./pages/game/home_page/GameHomePage";
import { GameMatchmakingPage } from "./pages/game/matchmaking/GameMatchmakingPage";
import { GamePlayPage } from "./pages/game/play_page/GamePlayPage";
import { Game } from "./pages/game/Game";
import { CookieError } from "./pages/error/CookieError";
import { RoomCreate } from "./pages/chat/room/add/create/RoomCreate";
import { Room } from "./pages/chat/room/Room";
import { UserProfilePage } from "./pages/user_profile/UserProfilePage";
import { ChangeNamePage } from "./pages/settings/change_name_page/ChangeNamePage";
import { SettingsHomePage } from "./pages/settings/SettingsHomePage";
import { Messages } from "./pages/chat/room/messages/Messages";
import { Root } from "./pages/root/Root";
import { UserProfile } from "./pages/user_profile/user_profile/UserProfile";
import { Ranking } from "./pages/user_profile/user_profile/Profile/Ranking/Ranking";
import { DeleteRoom } from "./pages/chat/room/param/DeleteRoom";
import { ChangePassword } from "./pages/chat/room/param/ChangePassword";
import { GameCreateGamePage } from "./pages/game/create_page/GameCreateGamePage";
import { FullAchievements } from "./pages/user_profile/user_profile/FullAchievements/FullAchievement";
import { RoomAdd } from "./pages/chat/room/add/RoomAdd";
import { RoomSearch } from "./pages/chat/room/add/search/RoomSearch";

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
              <Route
                path=""
                element={<Navigate to={"/board/user-account"} />}
              />
              <Route path="game" element={<Game />}>
                <Route path="" element={<GameHomePage />} />
                <Route path="matchmaking" element={<GameMatchmakingPage />} />
                <Route path="new-game" element={<GameCreateGamePage />} />
                <Route path=":id" element={<GamePlayPage />} />
              </Route>
              <Route path="chats" element={<ChatPage />}>
                <Route path="add">
                  <Route path="" element={<RoomAdd />} />
                  <Route path="create" element={<RoomCreate />} />
                  <Route path="search" element={<RoomSearch />} />
                </Route>
                <Route path="" element={<Room />} />
                <Route path=":id" element={<Room />}>
                  <Route path="" element={<Messages />} />
                  <Route path="param">
                    <Route path="" element={<RoomParam />} />
                    <Route path="delete" element={<DeleteRoom />} />
                    <Route
                      path="change-password"
                      element={<ChangePassword />}
                    />
                  </Route>
                </Route>
              </Route>
              <Route path="settings" element={<Settings />}>
                <Route path="" element={<SettingsHomePage />} />
                <Route path="update" element={<ChangeNamePage />} />
              </Route>
              <Route path="user-account" element={<UserProfilePage />}>
                <Route path="achievements" element={<FullAchievements />} />
                <Route path="" element={<UserProfile />} />
                <Route path=":id" element={<UserProfile />} />
                <Route path="ranking" element={<Ranking />} />
              </Route>
            </Route>
            <Route path="cookie-error" element={<CookieError />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HelmetProvider>
    </>
  );
}
export default App;
