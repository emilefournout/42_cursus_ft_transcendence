import React, { useState } from "react";
import { AddFriendForm } from "./AddFriendForm";
import { FriendList } from "./FriendList/FriendList";
import "./ProfileLeftBar.css";
export function ProfileLeftBar() {
  return (
    <div className="profileLeftBar">
      {/* My profile button*/}
      <AddFriendForm />
      <FriendList />
    </div>
  );
}
