import React from "react";
import { MatchHistoryCard, MatchResult } from "./MatchHistoryCard";
import "../Profile.css";
import { devlog } from "../../../../../services/core";

export interface UserScore {
  username: string;
  score: number;
  user_id: number;
}

interface UserMatchHistory {
  points_user1: number;
  points_user2: number;
  user1_id: number;
  user2_id: number;
  user1_username: string;
  user2_username: string;
}

interface MatchHistoryProps {
  userId: number;
  username: string;
}

export function MatchHistory(props: MatchHistoryProps) {
  const [history, setHistory] = React.useState<UserMatchHistory[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/user/history/${props.userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw new Error("Error getting match history");
      })
      .then((data) => {
        setHistory(data);
      })
      .catch((e) => {
        devlog(e);
      });
  }, [props.userId]);

  return (
    <div id="history-card">
      <div className="window-title card-title">History</div>
      {history === undefined ? (
        <div id="history-values" className="card-body">
          Loading
        </div>
      ) : history.length === 0 ? (
        <div id="history-values" className="card-body">
          No Matches
        </div>
      ) : (
        <div id="history-values" className="card-body">
          {history.map((match, index) => {
            let opponent: UserScore;
            let me: UserScore;
            let matchResult: MatchResult;
            let userScore_1: UserScore = {
              username: match.user1_username,
              score: match.points_user1 > 0 ? match.points_user1 : 0,
              user_id: match.user1_id,
            };
            let userScore_2: UserScore = {
              username: match.user2_username,
              score: match.points_user2 > 0 ? match.points_user2 : 0,
              user_id: match.user2_id,
            };
            if (match.user1_id === props.userId) {
              me = userScore_1;
              opponent = userScore_2;
              if (match.points_user1 > match.points_user2)
                matchResult = MatchResult.victory;
              else matchResult = MatchResult.defeat;
            } else {
              opponent = userScore_1;
              me = userScore_2;
              if (match.points_user1 > match.points_user2)
                matchResult = MatchResult.defeat;
              else matchResult = MatchResult.victory;
            }
            return (
              <MatchHistoryCard
                result={matchResult}
                me={me}
                opponent={opponent}
                key={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
