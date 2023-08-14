import React from "react";
import { ProfileLeftBar } from "./ProfileLeftBar/ProfileLeftBar";

export enum RequestType {
  enabled = "ENABLED",
  pending = "PENDING",
}
interface ProfileContextArgs {
  acceptedFriends: User[] | undefined;
  pendingFriends: User[] | undefined;
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
  >();

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
      const typedFriendsRequests = friendRequests.filter(
        (request: FriendRequest) => request.status === type
      );
      Promise.all(getAllFetchRequests(typedFriendsRequests))
        .then((users) =>
          type === RequestType.enabled
            ? setAcceptedFriends(users)
            : setPendingFriends(users)
        )
        .catch((error) => console.log(error));
    },
    [getAllFetchRequests]
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
