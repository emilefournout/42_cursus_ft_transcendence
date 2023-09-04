import React, { useEffect, useState } from "react";
import { WatchingGameCard } from "./WatchingGameCard";

export function WatchGameColumn() {
  const [activePlays, setActivePlays] = useState<Array<string>>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/game/active-plays`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting active plays");
        }
        return response.json();
      })
      .then((data: Array<string>) => {
        setActivePlays(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <>
      <div>currents game:</div>
      {activePlays.map((uuid) => {
        return <WatchingGameCard key={uuid} />;
      })}
    </>
  );
}
