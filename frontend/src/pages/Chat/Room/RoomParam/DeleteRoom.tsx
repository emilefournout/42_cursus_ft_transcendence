import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChatPageContext } from "../../Chat";

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
          alert("Room deleted");
          setTimeout(() => {
            navigate("/board/chats");
            chatPageContext.updateChat();
          }, 500);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div>
        <button onClick={() => delete_room()}>delete</button>
      </div>
      <div>
        <button onClick={() => navigate(back_route)}>back</button>
      </div>
    </>
  );
}
