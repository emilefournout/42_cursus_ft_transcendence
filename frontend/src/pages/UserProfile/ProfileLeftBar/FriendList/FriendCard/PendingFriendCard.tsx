import React from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import { FriendRequest } from "../FriendList";

interface PendingFriendCard {
  request: FriendRequest;
}
export function PendingFriendCard(props: PendingFriendCard) {
  return (
    <>
      {/*Avatar*/}

      <FriendStatus status={UserStatus.Offline} />
    </>
  );
}
