import React, { useState } from "react";
import { ProfileToolBar } from "./ProfileToolBar/ProfileToolBar";
import { FriendList } from "./FriendList/FriendList";
import "./ProfileLeftBar.css";
import { RequestType } from "../UserProfilePage";

export interface ProfileBarContextArgs {
  setRequestsType: React.Dispatch<React.SetStateAction<RequestType>>;
  requestsType: RequestType;
}

export const ProfileBarContext = React.createContext<ProfileBarContextArgs>(
  {} as ProfileBarContextArgs
);
export function ProfileLeftBar() {
  const [requestsType, setRequestsType] = useState<RequestType>(
    RequestType.enabled
  );

  return (
    <div className="profileLeftBar">
      {/* My profile button*/}
      <ProfileBarContext.Provider
        value={
          {
            requestsType: requestsType,
            setRequestsType: setRequestsType,
          } as ProfileBarContextArgs
        }
      >
        <ProfileToolBar />
        <FriendList />
      </ProfileBarContext.Provider>
    </div>
  );
}
