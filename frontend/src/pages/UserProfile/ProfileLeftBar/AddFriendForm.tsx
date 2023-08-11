import React, { useEffect, useState } from "react";
import "./ProfileLeftBar.css";

export function AddFriendForm() {
  const [newFriend, setNewFriend] = useState<string>("");

  useEffect(() => {
    return () => {};
  }, []);

  const addFriend = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/${newFriend}`, {
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
    <div className="input-add-friend">
      <input
        value={newFriend}
        type="text"
        placeholder="add new friend"
        onChange={(e) => setNewFriend(e.target.value)}
      />
      <button onClick={addFriend}>+</button>
      <div>
        <button>reload</button>
      </div>
    </div>
  );
}
