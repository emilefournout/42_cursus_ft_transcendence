import React from "react";
import "./FriendCard.css";
import { ProfilePageContext } from "../../../UserProfilePage";
import { Avatar } from "../../../../../components/Avatar";
import { FriendCardProps } from "./AcceptedFriendCard/AcceptedFriendCard";
export function ReceivedFriendCard(props: FriendCardProps) {
  const profilePageContext = React.useContext(ProfilePageContext);
  const accept = async () => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/user/friends/accept/${props.userInfo.id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Friend request accepted");
        } else {
          throw new Error("Error accepting friend request");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const decline = async () => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/user/friends/decline/${props.userInfo.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Friend request declined");
        } else {
          throw new Error("Error declining friend request");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleFriendRequest = async (action: () => Promise<void>) => {
    action().then(() => setTimeout(profilePageContext.updateFriends, 500));
  };

  return (
    <div className="friend-card">
      <Avatar url={props.userInfo.avatar} size="32px" upload={false} />

      <div>{props.userInfo.username}</div>
      <div>
        <button onClick={() => handleFriendRequest(accept)}>Accept</button>
      </div>
      <div>
        <button onClick={() => handleFriendRequest(decline)}>Decline</button>
      </div>
    </div>
  );
}