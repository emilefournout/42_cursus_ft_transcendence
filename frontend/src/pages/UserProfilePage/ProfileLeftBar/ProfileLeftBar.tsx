import React from "react";
import { AddFriendForm } from "./AddFriendForm";
import { FriendList } from "./FriendList/FriendList";
export function ProfileLeftBar() {
  return (
    <>
      {/* My profile button*/}
      <AddFriendForm />
      <FriendList />
    </>
  );
}
