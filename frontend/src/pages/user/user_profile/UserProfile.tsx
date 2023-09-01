import React from "react";
<<<<<<< Updated upstream
import { Profile } from "./profile/Profile";
=======
import { Profile } from "./user/Profile";
>>>>>>> Stashed changes
import { useParams } from "react-router-dom";
import { ProfilePageContext } from "../UserProfilePage";
import { BoardContext } from "../../board/Board";

export function UserProfile() {
  const boardContext = React.useContext(BoardContext);
  const { id } = useParams();
  const profilePageContext = React.useContext(ProfilePageContext);
  const userInfo =
    id === undefined || parseInt(id) === boardContext?.me.id
      ? boardContext?.me
      : profilePageContext.acceptedFriends?.find(
          (user) => user.id === parseInt(id)
        );

  if (userInfo === undefined) {
    return (
      <div className="prof-cards-wrapper">
        User not found! Try add him to friends first
      </div>
    );
  } else {
    return (
      <>
        <Profile userInfo={userInfo} />
        {/* Create navigation between Profile and FullAchievement*/}
      </>
    );
  }
}
