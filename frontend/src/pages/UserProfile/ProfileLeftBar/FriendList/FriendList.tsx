import React from "react";
import { AcceptedFriendCard } from "./FriendCard/AcceptedFriendCard";
import { ProfilePageContext, RequestType, User } from "../../UserProfilePage";
import { ProfileBarContext } from "../ProfileLeftBar";
import { PendingFriendCard } from "./FriendCard/PendingFriendCard";
import { ReceivedFriendCard } from "./FriendCard/ReceivedFriendCard";

export function FriendList() {
  const profileBarContext = React.useContext(ProfileBarContext);
  const profilePageContext = React.useContext(ProfilePageContext);

  if (
    (profileBarContext.requestsType === RequestType.enabled &&
      profilePageContext.acceptedFriends === undefined) ||
    (profileBarContext.requestsType === RequestType.pending &&
      (profilePageContext.pendingFriends === undefined ||
        profilePageContext.receivedFriends === undefined))
  ) {
    return <>loading</>;
  } else if (
    profileBarContext.requestsType === RequestType.enabled &&
    profilePageContext.acceptedFriends!.length === 0
  ) {
    return <>no friends loser</>;
  } else if (
    profileBarContext.requestsType === RequestType.pending &&
    profilePageContext.pendingFriends!.length === 0 &&
    profilePageContext.receivedFriends!.length === 0
  ) {
    return <>no pending requests</>;
  } else if (profileBarContext.requestsType === RequestType.enabled) {
    return (
      <>
        {profilePageContext.acceptedFriends!.map((userInfo: User, index) => {
          return (
            <div key={index}>
              <AcceptedFriendCard userInfo={userInfo} />
            </div>
          );
        })}
      </>
    );
  } else {
    return (
      <>
        <div>
          {profilePageContext.pendingFriends!.map((userInfo: User, index) => {
            return (
              <div key={index}>
                <PendingFriendCard userInfo={userInfo} />
              </div>
            );
          })}
        </div>
        <div>
          {profilePageContext.receivedFriends!.map((userInfo: User, index) => {
            return (
              <div key={index}>
                <ReceivedFriendCard userInfo={userInfo} />
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
