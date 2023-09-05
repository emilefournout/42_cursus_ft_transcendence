import React, { useEffect, useState } from "react";
import { ProfileLeftBar } from "./left_bar/ProfileLeftBar";
import { Outlet } from "react-router-dom";
import { BoardContext, User } from "../board/Board";
import "./UserProfilePage.css";
import { testing } from "../../services/core";

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
  ranking: User[] | undefined;
}

export interface FriendRequest {
  requester_id: number;
  adressee_id: number;
  status: string;
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

  const [ranking, setRanking] = useState<User[] | undefined>(undefined);

  const boardContext = React.useContext(BoardContext);
  const myId = boardContext?.me.id;

  const getUserInfoFromId = React.useCallback(
    async (friendId: number): Promise<User> => {
      return fetch(`${process.env.REACT_APP_BACKEND}/user/info/${friendId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
        .then((response) => {
          if (!response.ok) throw new Error("Error getting user info");
          return response.json();
        })
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
          friendRequest.adressee_id === myId
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
        (request: FriendRequest) => {
          if (type === RequestType.enabled) {
            return request.status === type;
          } else if (type === RequestType.pending) {
            return request.status === type && request.requester_id === myId;
          } else {
            return (
              request.status === RequestType.pending &&
              request.adressee_id === myId
            );
          }
        }
      );
      Promise.all(getAllFetchRequests(typedFriendsRequests))
        .then((users) =>
          type === RequestType.enabled
            ? setAcceptedFriends(users)
            : type === RequestType.pending
            ? setPendingFriends(users)
            : setReceivedFriends(users)
        )
        .catch((error) => {
          if (testing) console.log(error);
        });
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
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Error getting friends");
      })
      .then((data) => {
        const requests = data as FriendRequest[];
        setFriends(RequestType.enabled, requests);
        setFriends(RequestType.pending, requests);
        setFriends(RequestType.received, requests);
      })
      .catch((error) => {
        if (testing) console.log(error);
      });
  }, [setFriends]);

  React.useEffect(() => {
    if (myId === undefined) return;
    updateFriends();
    return () => {};
  }, [myId, updateFriends]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/ranking`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Error getting ranking");
      })
      .then((data) => {
        setRanking(data);
      })
      .catch((error) => {
        if (testing) console.log(error);
      });
  }, []);

  return (
    <>
      <ProfilePageContext.Provider
        value={
          {
            acceptedFriends: acceptedFriends,
            pendingFriends: pendingFriends,
            receivedFriends: receivedFriends,
            updateFriends: updateFriends,
            ranking: ranking,
          } as ProfileContextArgs
        }
      >
        <div id="user-page-container">
          <ProfileLeftBar />
          <Outlet />
        </div>
      </ProfilePageContext.Provider>
    </>
  );
}
