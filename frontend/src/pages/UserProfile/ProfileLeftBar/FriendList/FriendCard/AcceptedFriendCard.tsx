import React, { useState } from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import "./FriendCard.css";
import { Avatar } from "../../../../../components/Avatar";
import { User } from "../../../../Board/Board";
import { useNavigate } from "react-router-dom";
import { ProfilePageContext } from "../../../UserProfilePage";

export interface FriendCardProps {
  userInfo: User;
}
export function AcceptedFriendCard(props: FriendCardProps) {
  const [deleteIsSelected, setDeleteIsSelected] = useState<boolean>(false);
  const navigate = useNavigate();
  const profilePageContext = React.useContext(ProfilePageContext);
  const deleteUser = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/user/friends/delete/${props.userInfo.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert("Friend deleted");
          setTimeout(profilePageContext.updateFriends, 500);
        } else {
          throw new Error("Error deleting friend");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <>
      <div
        className="friend-card"
        onClick={() => navigate("/board/userAccount/" + props.userInfo.id)}
      >
        <Avatar url={props.userInfo.avatar} />
        <div>{props.userInfo.username}</div>
        <FriendStatus status={props.userInfo.status} />
      </div>
      <div>
        {deleteIsSelected ? (
          <>
            confirm delete : <div onClick={deleteUser}>yes</div>{" "}
            <div
              onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}
            >
              no
            </div>
          </>
        ) : (
          <div onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}>
            delete
          </div>
        )}
      </div>
    </>
  );
}
