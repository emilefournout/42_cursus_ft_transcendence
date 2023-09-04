import React, { useEffect, useState } from "react";

interface Invitations {
  invitations: Array<number>;
}
export function InvitationsColumns() {
  const [invitations, setInvitations] = useState<Array<number>>([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/game/invitations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error getting invitations");
        }
        return response.json();
      })
      .then((data: Invitations) => {
        setInvitations(data.invitations);
      })
      .catch((error) => {
        console.log(error);
      });
    return () => {};
  }, []);

  return (
    <div
      style={{
        float: "left",
      }}
    >
      <div>Invitations:</div>
      {invitations.map((id) => {
        return <div>{id} invited you </div>;
      })}
    </div>
  );
}
