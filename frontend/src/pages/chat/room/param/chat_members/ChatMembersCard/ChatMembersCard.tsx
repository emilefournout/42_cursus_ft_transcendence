import React, { useContext } from "react";
import { Member, RoomContextArgs } from "../../../Room";
import { useNavigate, useOutletContext } from "react-router-dom";
import ownerIcon from "./crownIcon.svg";
import adminIcon from "./shieldIcon.svg";
import { MuteDialogContext } from "../../RoomParam";
import { testing } from "../../../../../../services/core";
import { BoardContext } from "../../../../../board/Board";

export interface ChatMembersCardProps {
  member: Member;
  showButtons: boolean;
  key: number;
}

export function ChatMembersCard(props: ChatMembersCardProps) {
  const roomContextArgs = useOutletContext<RoomContextArgs>();
  const muteDialogContext = useContext(MuteDialogContext);
  const chadId = roomContextArgs.chat.id;
  const navigate = useNavigate();
  const boardContext = useContext(BoardContext);
  const isMe = boardContext?.me.id === props.member.userId;
  const style = isMe ? { backgroundColor: "green" } : {};
  const action = (route: string, method: string, body: string) =>
    fetch(`${process.env.REACT_APP_BACKEND}/${route}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: body,
    }).then((response) => {
      if (!response.ok) throw new Error("Error while muting");
      roomContextArgs.getChatInfo(roomContextArgs.chat);
    });

  const promote = () =>
    action(
      `chat/${chadId}/user`,
      "PATCH",
      JSON.stringify({
        userId: props.member.userId,
        role: {
          owner: false,
          administrator: true,
        },
      })
    ).catch((error) => {
      if (testing) console.log(error);
    });

  const demote = () =>
    action(
      `chat/${chadId}/user`,
      "PATCH",
      JSON.stringify({
        userId: props.member.userId,
        role: {
          owner: false,
          administrator: false,
        },
      })
    ).catch((error) => {
      if (testing) console.log(error);
    });

  const unmute = () => {
    action(
      `chat/${chadId}/mute`,
      "DELETE",
      JSON.stringify({ userId: props.member.userId })
    ).catch((error) => {
      if (testing) console.log(error);
    });
  };
  const kickOut = () =>
    action(
      `chat/${chadId}/user`,
      "DELETE",
      JSON.stringify({ id: props.member.userId })
    ).catch((error) => {
      if (testing) console.log(error);
    });

  if (!boardContext) {
    return <>Loading</>;
  } else {
    return (
      <>
        <div
          style={style}
          className="room-param-user-name ellipsed-txt"
          onClick={() => navigate(`/board/user-account/${props.member.userId}`)}
        >
          {props.member.username}
        </div>
        {props.member.owner ? (
          <img src={ownerIcon} title="Room Owner" alt="Room owner icon" />
        ) : props.member.administrator ? (
          <img
            src={adminIcon}
            title="Room Admin"
            alt="Room administrator icon"
          />
        ) : (
          <></>
        )}
        {props.member.owner || !props.showButtons ? (
          <></>
        ) : (
          <>
            {props.member.administrator ? (
              <button id="demote-btn" onClick={demote}>
                demote
              </button>
            ) : (
              <button id="promote-btn" onClick={promote}>
                promote
              </button>
            )}
            {isMe ? (
              <></>
            ) : (
              <>
                {props.member.muted ? (
                  <button id="unmute-btn" onClick={unmute}>
                    unmute
                  </button>
                ) : (
                  <button
                    id="mute-btn"
                    onClick={() => muteDialogContext.mute(props.member.userId)}
                  >
                    mute
                  </button>
                )}
                <button onClick={kickOut}>ban</button>
                <button onClick={kickOut}>kick out</button>
              </>
            )}
          </>
        )}
        {isMe ? (
          <></>
        ) : (
          <>
            <button
              onClick={() => {
                navigate("/board/game/new-game", {
                  state: {
                    invite: props.member.username,
                  },
                });
              }}
            >
              Invite
            </button>
          </>
        )}
      </>
    );
  }
}
