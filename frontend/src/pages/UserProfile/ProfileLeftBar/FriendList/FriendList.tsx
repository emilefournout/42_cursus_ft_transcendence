import React, { useEffect, useState } from "react";
import { AcceptedFriendCard } from "./FriendCard/AcceptedFriendCard";
import { ProfilePageContext, RequestType } from "../../UserProfilePage";
import { ProfileBarContext } from "../ProfileLeftBar";
import { PendingFriendCard } from "./FriendCard/PendingFriendCard";

export interface FriendRequest {
  requester_id: number;
  addressee_id: number;
  status: string;
}
export function FriendList() {
  const profileBarContext = React.useContext(ProfileBarContext);
  const profileContext = React.useContext(ProfilePageContext);

  const [requests, setRequests] = useState<FriendRequest[] | undefined>(
    undefined
  );

  useEffect(() => {
    profileBarContext.requestsType === RequestType.enabled
      ? setRequests(profileContext.enabledRequests)
      : setRequests(profileContext.pendingRequests);
    return () => {};
  }, [
    profileContext.enabledRequests,
    profileContext.pendingRequests,
    profileBarContext.requestsType,
  ]);

  if (requests === undefined) {
    return <div>Loading</div>;
  } else if (requests.length === 0) {
    return <div>you got no friend loser</div>;
  } else {
    const FriendCard =
      profileBarContext.requestsType === RequestType.enabled
        ? AcceptedFriendCard
        : PendingFriendCard;

    return (
      <>
        {requests.map((friendRequest: FriendRequest) => {
          return <FriendCard request={friendRequest} />;
        })}
      </>
    );
  }
}
