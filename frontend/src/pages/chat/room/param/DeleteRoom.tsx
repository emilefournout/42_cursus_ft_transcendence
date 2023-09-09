import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChatPageContext } from "../../Chat";
import { devlog } from "../../../../services/core";
import { ErrorBody } from "./RoomParam";

export function DeleteRoom() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const back_route = location.pathname.replace("delete", "");
  const chatPageContext = React.useContext(ChatPageContext);
  const delete_room = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/chat/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setTimeout(() => {
            chatPageContext
              .updateChats()
              .then(() => {
                navigate("/board/chats");
              })
              .catch((error) => {
                devlog(error);
              });
          }, 500);
        } else {
          {
            response
              .json()
              .then((data: ErrorBody) => {
                if (data.message && data.message === "User not in chat") {
                  chatPageContext.updateLeaver(
                    "You are not member of this chat"
                  );
                }
                return;
              })
              .catch((error) => {
                devlog(error);
              });
          }
        }
      })
      .catch((error) => {
        devlog(error);
      });
  };

  return (
    <div className="param-subpage-container">
      <button id="delete-page-del-btn" onClick={() => delete_room()}>
        delete
      </button>
      <button onClick={() => navigate(back_route)}>back</button>
    </div>
  );
}
