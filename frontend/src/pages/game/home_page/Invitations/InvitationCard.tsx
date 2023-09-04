import React, { useEffect } from "react";
import { GameSocket } from "../../../../services/socket";
import { useNavigate } from "react-router-dom";

interface InvitationCardProps {
  id: number;
  key: number;
}
export function InvitationCard(props: InvitationCardProps) {
	const gameSocket = GameSocket.getInstance().socket;
	const navigate = useNavigate();

  useEffect(() => {
		gameSocket.off("game_found");
		gameSocket.on("game_found", (gameId) => {
			navigate(`./${gameId}`);
		});
	}, [gameSocket]);

  return (
    <div>
      {props.id} invited you{" "}
      <button
        onClick={() => {
					gameSocket.emit('join_private_room', props.id)
				}}
      >
        accept
      </button>
    </div>
  );
}
