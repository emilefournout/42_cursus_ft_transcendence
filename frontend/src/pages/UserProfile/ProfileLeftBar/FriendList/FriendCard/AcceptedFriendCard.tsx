import React from "react";
import { FriendStatus, UserStatus } from "../FriendStatus";
import { FriendRequest } from "../FriendList";

interface AcceptedFriendCard {
  request: FriendRequest;
}
export function AcceptedFriendCard(props: AcceptedFriendCard) {
  return (
    <>
      {/*Avatar*/}

      <FriendStatus status={UserStatus.Offline} />
    </>
  );
}
