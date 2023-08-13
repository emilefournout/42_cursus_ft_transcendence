import React from "react";
import { ProfileLeftBar } from "./ProfileLeftBar/ProfileLeftBar";
import { FriendRequest } from "./ProfileLeftBar/FriendList/FriendList";

export enum RequestType {
  enabled = "ENABLED",
  pending = "PENDING",
}
interface ProfileContextArgs {
  enabledRequests: FriendRequest[];
  pendingRequests: FriendRequest[];
  updateFriends: () => void;
}
export const ProfilePageContext = React.createContext<ProfileContextArgs>(
  {} as ProfileContextArgs
);
export function UserProfilePage() {
  const [acceptedRequests, setAcceptedRequests] = React.useState<
    FriendRequest[] | undefined
  >(undefined);

  const [pendingRequests, setPendingRequests] = React.useState<
    FriendRequest[] | undefined
  >(undefined);
  const updateFriends = () => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/friendships`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const requests = data as FriendRequest[];
        const acceptedRequestsTmp: FriendRequest[] = requests.filter(
          (request: FriendRequest) => request.status === RequestType.enabled
        );
        const pendingRequestsTmp: FriendRequest[] = requests.filter(
          (request: FriendRequest) => request.status === RequestType.pending
        );
        console.log("acceptedRequestsTmp", acceptedRequestsTmp);
        console.log("pendingRequestsTmp", pendingRequestsTmp);
        setAcceptedRequests(acceptedRequestsTmp);
        setPendingRequests(pendingRequestsTmp);
      });
  };

  React.useEffect(() => {
    updateFriends();
    return () => {};
  }, []);

  return (
    <>
      <ProfilePageContext.Provider
        value={
          {
            enabledRequests: acceptedRequests,
            pendingRequests: pendingRequests,
            updateFriends: updateFriends,
          } as ProfileContextArgs
        }
      >
        <ProfileLeftBar />
      </ProfilePageContext.Provider>

      {/*<UserProfile />*/}
    </>
  );
}
