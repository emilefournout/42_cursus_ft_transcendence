import React, { useEffect, useState } from "react";

export function WatchGameColumn() {
  const [activePlays, setActivePlays] = useState<Array<String>>([]);

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
      .then((data: Array<String>) => {
        setActivePlays(data);
      });
  }, []);
  return <></>;
}
