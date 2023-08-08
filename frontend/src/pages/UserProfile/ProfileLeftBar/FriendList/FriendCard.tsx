import React from "react";
import { FriendStatus, UserStatus } from "./FriendStatus";

interface Props {
  name: String;
  status: UserStatus;
}
export function FriendCard({ name, status }: Props) {
  return (
    <>
      {/*Avatar*/}
      {name}
      <FriendStatus status={status} />
    </>
  );
}
