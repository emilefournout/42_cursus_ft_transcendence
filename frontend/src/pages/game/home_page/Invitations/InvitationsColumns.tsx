import React, { useEffect, useState } from "react";
import { InvitationCard } from "./InvitationCard";

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
    <div className="wrapper-col">
      <div>Invitations:</div>
      {invitations.length === 0 ||
      (invitations.length == 1 && invitations[0] == null) ? (
        <>No one invited you</>
      ) : (
        invitations.map((id, index) => {
          if (id == null) return <></>;
          return <InvitationCard id={id} key={index} />;
        })
      )}
    </div>
  );
}
