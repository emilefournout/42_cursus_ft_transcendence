import React, { useEffect, useState } from "react";
import { InvitationCard } from "./InvitationCard";
import { devlog } from "../../../../services/core";

export function InvitationsColumns() {
  const [invitations, setInvitations] = useState<Array<any>>([]);

  const fetch_invitations = async () =>
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
      .then((data: any) => {
        setInvitations(data.invitations);
      })
      .catch((error) => {
        devlog(error);
      });

  useEffect(() => {
    fetch_invitations();
    return () => {};
  }, []);

  return (
    <div className="wrapper-col single-col-wrapper">
      <button className="btn game-creation-btn" onClick={fetch_invitations}>
        Reload
      </button>
      <div className="columns-txt" style={{ marginBottom: "8px" }}>
        Invitations:
      </div>
      {invitations.length === 0 ? (
        <div className="columns-txt">No one invited you</div>
      ) : (
        invitations.map((invitation, index) => {
          if (!invitation) return null;
          return (
            <InvitationCard
              id={invitation.inviterId}
              username={invitation.username}
              key={index}
            />
          );
        })
      )}
    </div>
  );
}
