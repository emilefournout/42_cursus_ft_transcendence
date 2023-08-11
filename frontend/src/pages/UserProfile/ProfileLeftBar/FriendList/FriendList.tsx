import React, { useEffect, useState } from "react";
import { FriendCard } from "./FriendCard";
import { UserStatus } from "./FriendStatus";

const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
const API = async () => {
  await delay(1000);
  return [
    {
      id: 1,
      name: "John",
      status: UserStatus.Offline,
    },
    {
      id: 2,
      name: "Emile",
      status: UserStatus.Offline,
    },
  ];
};

export function FriendList() {
  const [friends, setFriends] = useState([{}]);

  const updateFriends = () => {
    API().then((data) => setFriends(data));
  };
  useEffect(() => {
    updateFriends();
    return () => {};
  }, []);

  return (
    <>
      {friends.map((friend: any) => {
        return <FriendCard name={friend.name} status={UserStatus.Offline} />;
      })}
    </>
  );
}
