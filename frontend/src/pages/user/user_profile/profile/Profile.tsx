import React, { useEffect, useState } from "react";
import { Stats } from "./stats/Stats";
import { MatchHistory } from "./match_history/MatchHistory";
import { Achievements } from "./achievements/Achievements";
import { Avatar } from "../../../../components/Avatar";
import { BoardContext, RequestMethod, User } from "../../../board/Board";
import "./Profile.css";
import { devlog } from "../../../../services/core";

interface ProfileProps {
  userInfo?: User;
}

export function Profile(props: ProfileProps) {
  const boardContext = React.useContext(BoardContext);
  const userInfo = props.userInfo ?? boardContext?.me;
  const userId = userInfo?.id;
  const isBlocked =
    userId !== undefined ? boardContext?.blockedUsers.has(userId) : undefined;

  const handleBlock = () => {
    if (!userId) {
      return;
    }
    const method: RequestMethod = isBlocked
      ? RequestMethod.delete
      : RequestMethod.post;
    boardContext?.updateBlockedUsers(method, userId);
  };

  if (boardContext === undefined || isBlocked === undefined) {
    return <div className="prof-cards-wrapper">Loading...</div>;
  } else if (userInfo === undefined) {
    return <div className="prof-cards-wrapper">User not found</div>;
  } else {
    return (
      <div className="prof-cards-wrapper">
        <Avatar url={userInfo.avatar} upload={false} download={true} />
        <div id="prof-user-name" className="ellipsed-txt">
          {"@" + userInfo.username}
        </div>
        {userInfo.id !== boardContext.me.id &&
          (isBlocked ? (
            <button onClick={handleBlock}>unblock</button>
          ) : (
            <button onClick={handleBlock}>block</button>
          ))}
        <div className="cards-container">
          <Stats wins={userInfo.wins} loses={userInfo.loses} id={userInfo.id} />
          <MatchHistory userId={userInfo.id} username={userInfo.username} />
          <Achievements userId={userInfo.id} />
        </div>
      </div>
    );
  }
}
