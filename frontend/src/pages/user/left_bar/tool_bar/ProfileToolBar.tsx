import React, { useContext, useState } from "react";
import "../ProfileLeftBar.css";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { RequestTypeButton } from "./RequestTypeButton";
import ReloadBlackIcon from "../../../../common/reload_honey.svg";
import AddFriendIcon from "./AddFriendIcon.svg";
import SearchIcon from "./SearchIcon.svg";
import { DialogContext } from "../../../root/Root";
import { devlog } from "../../../../services/core";
import { BoardContext } from "../../../board/Board";
import { useNavigate } from "react-router-dom";

export function ProfileToolBar() {
  const [newFriend, setNewFriend] = useState<string>("");
  const profileContext = React.useContext(ProfilePageContext);
  const dialogContext = useContext(DialogContext);
  const boardContext = useContext(BoardContext);
  const setDialog = dialogContext.setDialog;
  const navigate = useNavigate();

  const getUsernameId = async () =>
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
      .catch((error) => {
        devlog(error);
      });

  const addFriend = () => {
    getUsernameId()
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
      .catch((error) => {
        devlog(error);
      });
  };

  const clearState = () => {
    setNewFriend("");
  };

  const searchFriend = () => {
    getUsernameId()
      .then((data) => {
        navigate(`/board/user-account/${data.id}`);
      })
      .catch((error) => {
        devlog(error);
      });
  };

  if (boardContext === undefined) return <></>;
  else {
    return (
      <div id="prof-tool-bar-container">
        <div className="input-add-friend wrapper-row">
          <input
            value={newFriend}
            type="text"
            placeholder="Add Friend!"
            onChange={(e) => setNewFriend(e.target.value)}
            onKeyDown={(e) => {
              e.key === "Enter" && addFriend();
            }}
          />
          <img
            className="nav-icons"
            src={SearchIcon}
            onClick={searchFriend}
            alt="Add friend icon"
          />
          <img
            className="nav-icons"
            src={AddFriendIcon}
            onClick={addFriend}
            alt="Add friend icon"
          />
          <img
            className="nav-icons"
            style={{ background: "var(--Darks-Back)" }}
            src={ReloadBlackIcon}
            onClick={() => {
              profileContext.updateFriends();
              boardContext.updateWatchGame();
              boardContext.getBlockedUsers();
            }}
            alt="Reload friend list icon"
          />
        </div>
        <div className="request-type-buttons">
          <RequestTypeButton type={RequestType.enabled} />
          <RequestTypeButton type={RequestType.pending} />
        </div>
      </div>
    );
  }
}
