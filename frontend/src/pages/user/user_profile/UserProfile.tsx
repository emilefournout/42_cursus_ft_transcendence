import React, { useEffect, useState } from "react";
import { Profile } from "./profile/Profile";
import { useParams } from "react-router-dom";
import { ProfilePageContext } from "../UserProfilePage";
import { BoardContext, User } from "../../board/Board";

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
  const [fetchedUserInfo, setFetchedUserInfo] = useState<User | undefined>(
    undefined
  );
  useEffect(() => {
    if (userInfo === undefined && id !== undefined) {
      fetch(`${process.env.REACT_APP_BACKEND}/user/info/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error getting user info");
          return response.json();
        })
        .then((data: User) => setFetchedUserInfo(data))
        .catch((error) => {
          throw error;
        });
    } else {
      setFetchedUserInfo(undefined);
    }
    return () => {};
  }, [id, userInfo]);

  if (userInfo === undefined && fetchedUserInfo === undefined) {
    return <div className="prof-cards-wrapper">Loading user profile...</div>;
  } else {
    return (
      <>
        <Profile userInfo={fetchedUserInfo ?? userInfo} />
        {/* Create navigation between Profile and FullAchievement*/}
      </>
    );
  }
}
