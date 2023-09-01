import React, { useContext, useState } from "react";
import "../ProfileLeftBar.css";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { RequestTypeButton } from "./RequestTypeButton";
import ReloadBlackIcon from "../../../../common/reload_honey.svg";
import AddFriendIcon from "./AddFriendIcon.svg";
import { DialogContext } from "../../../Root/Root";

export function ProfileToolBar() {
  const [newFriend, setNewFriend] = useState<string>("");
  const profileContext = React.useContext(ProfilePageContext);
  const dialogContext = useContext(DialogContext);
  const setDialog = dialogContext.setDialog;
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
          setDialog("User not found");
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
          setDialog("Friend request sent");
          profileContext.updateFriends();
          clearState();
        } else {
          response.json().then((data) => setDialog(data.message));
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
      <div id="prof-tool-bar-container">
        {/* THE MY PROFILE IS REDUNDANT SINCE THE USER CAN CLICK THENT ICON IN THE NAVBAR. THE RANKING ONE IS BETTER PLACED INSIDE THE STATS SUBWINDOW  */}

        {/* <div
         *     style={{
         *         display: "flex",
         *         flexDirection: "row",
         *         gap: "10px",
         *     }}
         * >
         *     <button onClick={() => navigate("/board/userAccount")}>
         *         my profil
         *     </button>
         *     <button onClick={() => navigate("/board/userAccount/ranking")}>
         *         ranking
         *     </button>
         * </div> */}

        <div className="input-add-friend wrapper-row">
          <input
            value={newFriend}
            type="text"
            placeholder="Add Friend!"
            onChange={(e) => setNewFriend(e.target.value)}
          />
          <img className="nav-icons" src={AddFriendIcon} onClick={addFriend} alt="Add friend icon" />
          <img
            className="nav-icons"
            src={ReloadBlackIcon}
            onClick={profileContext.updateFriends}
            alt="Reload friend list icon"
          />
        </div>
        <div className="request-type-buttons">
          <RequestTypeButton type={RequestType.enabled} />
          <RequestTypeButton type={RequestType.pending} />
        </div>
      </div>
    </>
  );
}
