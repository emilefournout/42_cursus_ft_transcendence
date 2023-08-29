import React, { useState } from "react";

export function AddUser() {
  const [newUser, setNewUser] = useState<string>("");
  const addUser = () => {
    console.log("click");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "25px",
      }}
    >
      <input
        type="text"
        placeholder="Add new user"
        value={newUser}
        style={{ width: "35%" }}
        onChange={(e) => setNewUser(e.target.value)}
      />
      <div onClick={addUser}>+</div>
    </div>
  );
}
