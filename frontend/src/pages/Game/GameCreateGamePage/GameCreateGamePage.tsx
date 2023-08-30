import React, { useState } from "react";
import SEO from "../../../components/Seo";
import "./GameCreateGamePage.css";

export function GameCreateGamePage() {
  const [numberValue, setValue] = useState(10)
  const MAX_GOALS = 25;
  const MIN_GOALS = 5;
  return (
    <>
      <SEO
        title="Pong - Matchmaking"
        description="Start a game with someone from the Internet or one of your friends."
      />
      <div className="wrapper-matchmaking">
        <p className="matchmaking-scaling">Create a new game for you</p>
        <fieldset>
          <label htmlFor="numberOfGoals" >Number of Goals (5 - 25)</label>
          <input id="numberOfGoals" type="number" min={MIN_GOALS} max={MAX_GOALS} value={numberValue} onChange={checkValueLimits}/>
          <label htmlFor="speedControl" >SpeedControl</label>
          <input id="speedControl" type="range" min={0.75} max={1.25} step={0.01} defaultValue={1}/>
          <label htmlFor="powerUp">PowerUps</label>
          <div className="wrapper-col-centered">
            <input id="powerUp" type="checkbox"/>
          </div>
        </fieldset>
        <button className="btn btn-fixed-height">
          Create (TODO)
        </button>
      </div>
    </>
  );

  function checkValueLimits(event: React.ChangeEvent<HTMLInputElement>) {
    const value: number = parseInt(event.target.value);
    if (Number.isInteger(value)){
      if (value > MAX_GOALS)
        setValue(MAX_GOALS);
      else if (value < MIN_GOALS)
        setValue(MIN_GOALS);
      else
        setValue(value);
    }
  };
}
