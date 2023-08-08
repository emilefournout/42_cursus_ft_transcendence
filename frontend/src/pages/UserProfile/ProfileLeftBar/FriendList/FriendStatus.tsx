import React from "react";

export enum UserStatus {
  Online,
  Offline,
  InGame,
}

interface Props {
  status: UserStatus;
}
export function FriendStatus({ status }: Props) {
  if (status == UserStatus.Online) {
    return <div>Online</div>;
  } else if (status == UserStatus.Offline) {
    return <div>Offline</div>;
  } else if (status == UserStatus.InGame) {
    return <div>In Game</div>;
  } else {
    throw new Error("Unknown StatType");
  }
}
