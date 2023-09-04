import React, { useEffect, useState } from "react";
import { ProfilePageContext } from "../../../../UserProfilePage";
import { GameSocket } from "../../../../../../services/socket";
import { useNavigate } from "react-router-dom";
import { testing } from "../../../../../../services/core";

interface CardActionProps {
  userId: number;
}

export function CardAction(props: CardActionProps) {
  const gameSocket = GameSocket.getInstance().socket;
  const [deleteIsSelected, setDeleteIsSelected] = useState<boolean>(false);
  const [invited, setInvited] = useState<boolean>(false);
  const profilePageContext = React.useContext(ProfilePageContext);
  const navigate = useNavigate();

  useEffect(() => {
    gameSocket.off("game_found");
    gameSocket.on("game_found", (gameId) => {
      navigate(`../game/${gameId}`);
    });
  }, [gameSocket]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/game/invitations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        return null;
      })
      .then((data) => {
        if (testing) console.log(`data type is ${typeof data}`);
        if (data && testing)
          console.log(`data.invitations is ${data.invitations}`);
        if (data) {
          data.invitations.forEach((id: number) => {
            if (id === props.userId) setInvited(true);
          });
        }
      });
  });

  const deleteUser = () => {
    fetch(
      `${process.env.REACT_APP_BACKEND}/user/friends/delete/${props.userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          setTimeout(profilePageContext.updateFriends, 500);
        } else {
          throw new Error("Error deleting friend");
        }
      })
      .catch((e) => {
        if (testing) console.log(e);
      });
  };
  return (
    <>
      {deleteIsSelected ? (
        <div className="friend-card-delete-txt">
          You sure?
          <button onClick={deleteUser}>yes</button>
          <button
            onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}
          >
            no
          </button>
        </div>
      ) : (
        <button
          className="friend-card-subtitle-2"
          onClick={() => setDeleteIsSelected((isSelected) => !isSelected)}
        >
          Delete
        </button>
      )}
      {invited && (
        <button
          className="friend-card-subtitle-1"
          onClick={() => {
            gameSocket.emit("join_private_room", props.userId);
          }}
        >
          Play
        </button>
      )}
    </>
  );
}
