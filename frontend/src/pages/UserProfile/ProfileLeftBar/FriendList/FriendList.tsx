import React, { useEffect, useState } from "react";
import { AcceptedFriendCard } from "./FriendCard/AcceptedFriendCard";
import {
  FriendRequest,
  ProfilePageContext,
  RequestType,
  User,
} from "../../UserProfilePage";
import { ProfileBarContext } from "../ProfileLeftBar";
import { PendingFriendCard } from "./FriendCard/PendingFriendCard";

export function FriendList() {
  const profileBarContext = React.useContext(ProfileBarContext);
  const profilePageContext = React.useContext(ProfilePageContext);
  const FriendCard =
    profileBarContext.requestsType === RequestType.enabled
      ? AcceptedFriendCard
      : PendingFriendCard;
  const friends =
    profileBarContext.requestsType === RequestType.enabled
      ? profilePageContext.acceptedFriends
      : profilePageContext.pendingFriends;
  if (friends === undefined) {
    return <>loading</>;
  } else if (friends.length === 0) {
    return <>no friends loser</>;
  } else {
    return (
      <>
        {friends.map((userInfo: User, index) => {
          return (
            <div key={index}>
              <FriendCard userInfo={userInfo} />
            </div>
          );
        })}
      </>
    );
  }
}
