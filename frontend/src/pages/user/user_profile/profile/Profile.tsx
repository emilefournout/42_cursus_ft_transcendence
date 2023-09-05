import React from "react";
import { Stats } from "./stats/Stats";
import { MatchHistory } from "./match_history/MatchHistory";
import { Achievements } from "./achievements/Achievements";
import { Avatar } from "../../../../components/Avatar";
import { BoardContext, User } from "../../../board/Board";
import "./Profile.css";

interface ProfileProps {
  userInfo?: User;
}

export function Profile(props: ProfileProps) {
  const boardContext = React.useContext(BoardContext);
  const userInfo = props.userInfo ?? boardContext?.me;
  const isBlocked = false;
  if (userInfo === undefined) {
    return (
      <div className="prof-cards-wrapper">
        User is not your friend ! Try add him to friends first
      </div>
    );
  } else {
    return (
      <div className="prof-cards-wrapper">
        <Avatar url={userInfo.avatar} upload={false} download={true} />
        <div id="prof-user-name" className="ellipsed-txt">
          {"@" + userInfo.username}
        </div>
        {isBlocked ? <button>unblock</button> : <button>block</button>}
        <div className="cards-container">
          <Stats wins={userInfo.wins} loses={userInfo.loses} id={userInfo.id} />
          <MatchHistory userId={userInfo.id} username={userInfo.username} />
          <Achievements userId={userInfo.id} />
        </div>
      </div>
    );
  }
}
