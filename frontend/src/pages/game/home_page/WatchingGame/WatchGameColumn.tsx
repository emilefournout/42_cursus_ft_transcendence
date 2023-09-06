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
      <div className="wrapper-col">
        <button onClick={() => boardContext?.updateWatchGame()}>reload</button>
        <div>currents game:</div>
        {activePlays && activePlays.length === 0 ? (
          <>No game to watch</>
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
