import React from "react";
import { FriendCard } from "./FriendCard";
import { UserStatus } from "./FriendStatus";
export function FriendList() {
  return (
    <>
      <FriendCard name={"apena-ba"} status={UserStatus.Online} />
      <FriendCard name={"jarredon"} status={UserStatus.Offline} />
      <FriendCard name={"josesanc"} status={UserStatus.InGame} />
      <FriendCard name={"ntamayo"} status={UserStatus.Offline} />
      <FriendCard name={"efournou"} status={UserStatus.Online} />
    </>
  );
}
