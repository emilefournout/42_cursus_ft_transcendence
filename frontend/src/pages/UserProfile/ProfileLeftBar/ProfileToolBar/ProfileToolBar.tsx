import React, { useState } from "react";
import "../ProfileLeftBar.css";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { RequestTypeButton } from "./RequestTypeButton";

export function ProfileToolBar() {
  const [newFriend, setNewFriend] = useState<string>("");
  const profileContext = React.useContext(ProfilePageContext);

  const addFriend = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/info/username/${newFriend}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        else {
          alert("User not found");
          throw new Error();
        }
      })
      .then((data) =>
        fetch(`${process.env.REACT_APP_BACKEND}/user/friends/send/${data.id}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        })
      )
      .then((response) => {
        if (response.ok) {
          alert("Friend request sent");
          profileContext.updateFriends();
          clearState();
        } else {
          response.json().then((data) => alert(data.message));
          throw new Error();
        }
      })
      .catch((error) => console.log(error));
  };

  const clearState = () => {
    setNewFriend("");
  };

  return (
    <>
      <div className="input-add-friend">
        <input
          value={newFriend}
          type="text"
          placeholder="add new friend"
          onChange={(e) => setNewFriend(e.target.value)}
        />
        <button onClick={addFriend}>+</button>
        <div>
          <button onClick={profileContext.updateFriends}>reload</button>
        </div>
      </div>
      <div className="request-type-buttons">
        <div>
          <RequestTypeButton type={RequestType.enabled} />
        </div>
        <div>
          <RequestTypeButton type={RequestType.pending} />
        </div>
      </div>
    </>
  );
}
