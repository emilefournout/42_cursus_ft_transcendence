import React from "react";

interface InvitationCardProps {
  id: number;
  key: number;
}
export function InvitationCard(props: InvitationCardProps) {
  return (
    <div>
      {props.id} invited you <button>accept</button>
    </div>
  );
}
