import React from "react";
import { ProfileLeftBar } from "./ProfileLeftBar/ProfileLeftBar";

export enum RequestType {
  enabled = "ENABLED",
  pending = "PENDING",
  received = "RECEIVED",
}
interface ProfileContextArgs {
  acceptedFriends: User[] | undefined;
  pendingFriends: User[] | undefined;
  receivedFriends: User[] | undefined;
  updateFriends: () => void;
}
export interface FriendRequest {
  requester_id: number;
  adressee_id: number;
  status: string;
}
export interface User {
  id: number;
  username: string;
  avatar: string;
  status: string;
  wins: number;
}

export const ProfilePageContext = React.createContext<ProfileContextArgs>(
  {} as ProfileContextArgs
);
export function UserProfilePage() {
  const [acceptedFriends, setAcceptedFriends] = React.useState<
    User[] | undefined
  >(undefined);

  const [pendingFriends, setPendingFriends] = React.useState<
    User[] | undefined
  >(undefined);

  const [receivedFriends, setReceivedFriends] = React.useState<
    User[] | undefined
  >(undefined);

  const myId = localStorage.getItem("user_id");

  const getUserInfoFromId = React.useCallback(
    async (friendId: number): Promise<User> => {
      return fetch(
        `${process.env.REACT_APP_BACKEND}/user/info/id/${friendId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      )
        .then((response) => response.json())
        .then((data: User) => data as User)
        .catch((error) => {
          throw error;
        });
    },
    []
  );

  const getAllFetchRequests = React.useCallback(
    (typedFriendsRequests: FriendRequest[]): Promise<User>[] => {
      return typedFriendsRequests.map((friendRequest) => {
        const friendId =
          friendRequest.adressee_id.toString() === myId
            ? friendRequest.requester_id
            : friendRequest.adressee_id;
        return getUserInfoFromId(friendId);
      });
    },
    [myId, getUserInfoFromId]
  );

  const setFriends = React.useCallback(
    (type: RequestType, friendRequests: FriendRequest[] | undefined) => {
      if (friendRequests === undefined) return;
      console.log(friendRequests);
      console.log("my id");
      const typedFriendsRequests = friendRequests.filter(
        (request: FriendRequest) => {
          if (type === RequestType.enabled) {
            return request.status === type;
          } else if (type === RequestType.pending) {
            return (
              request.status === type &&
              request.requester_id.toString() === myId
            );
          } else {
            return (
              request.status === RequestType.pending &&
              request.adressee_id.toString() === myId
            );
          }
        }
      );
      console.log(typedFriendsRequests);
      Promise.all(getAllFetchRequests(typedFriendsRequests))
        .then((users) =>
          type === RequestType.enabled
            ? setAcceptedFriends(users)
            : type === RequestType.pending
            ? setPendingFriends(users)
            : setReceivedFriends(users)
        )
        .catch((error) => console.log(error));
    },
    [getAllFetchRequests, myId]
  );

  const updateFriends = React.useCallback(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/friendships`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const requests = data as FriendRequest[];
        setFriends(RequestType.enabled, requests);
        setFriends(RequestType.pending, requests);
        setFriends(RequestType.received, requests);
      })
      .catch((error) => console.log(error));
  }, [setFriends]);

  React.useEffect(() => {
    updateFriends();
    return () => {};
  }, [updateFriends]);

  return (
    <>
      <ProfilePageContext.Provider
        value={
          {
            acceptedFriends: acceptedFriends,
            pendingFriends: pendingFriends,
            receivedFriends: receivedFriends,
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
