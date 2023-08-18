import React from "react";
import { Stats } from "./Stats/Stats";
import { MatchHistory } from "./MatchHistory/MatchHistory";
import { Achievements } from "./Achievements/Achievements";
import { Avatar } from "../../../../components/Avatar";
import { BoardContext, User } from "../../../Board/Board";

interface ProfileProps {
  userInfo?: User;
}
export function Profile(props: ProfileProps) {
  const boardContext = React.useContext(BoardContext);
  const userInfo = props.userInfo ?? boardContext?.me;

  if (userInfo === undefined) {
    return <>user not found</>;
  } else {
    return (
      <>
        <Avatar url={userInfo.avatar} />
        <div>@{userInfo.username}</div>

        <Stats wins={userInfo.wins} loses={userInfo.loses} id={userInfo.id} />
        <MatchHistory userId={userInfo.id} username={userInfo.username} />
        <Achievements />
      </>
    );
  }
}
