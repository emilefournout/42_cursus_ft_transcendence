import React, { useContext } from "react";
import { WatchingGameCard } from "./WatchingGameCard";
import { BoardContext } from "../../../board/Board";

export function WatchGameColumn() {
  const boardContext = useContext(BoardContext);
  const activePlays = boardContext?.currentGames;

  if (boardContext === undefined) {
    return <></>;
  } else {
    return (
      <div className="wrapper-col single-col-wrapper">
        <button
          className="btn game-creation-btn"
          onClick={() => boardContext?.updateWatchGame()}
        >
          reload
        </button>
        <div className="columns-txt" style={{ marginBottom: "8px" }}>
          Ongoing games:
        </div>
        {activePlays && activePlays.length === 0 ? (
          <div className="columns-txt">No games to watch</div>
        ) : (
          activePlays &&
          activePlays.map((game) => {
            return <WatchingGameCard uuid={game.uuid} key={game.uuid} />;
          })
        )}
      </div>
    );
  }
}
