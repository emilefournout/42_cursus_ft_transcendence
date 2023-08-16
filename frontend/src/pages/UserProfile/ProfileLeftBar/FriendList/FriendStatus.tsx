import React from "react";

export enum UserStatus {
  Online = "ONLINE",
  Offline = "OFFLINE",
  InGame = "INGAME",
}

interface Props {
  status: string;
}
export function FriendStatus({ status }: Props) {
  if (status === UserStatus.Online) {
    return <div>Online</div>;
  } else if (status === UserStatus.Offline) {
    return <div>Offline</div>;
  } else if (status === UserStatus.InGame) {
    return <div>In Game</div>;
  } else {
    throw new Error("Unknown StatType");
  }
}
