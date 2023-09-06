import React, { useEffect, useRef, useState } from "react";
import SEO from "../../../components/Seo";
import "./GameCreatePage.css";
import { GameSocket } from "../../../services/socket";
import { useLocation, useNavigate } from "react-router-dom";
import { testing } from "../../../services/core";

export function GameCreatePage() {
  const [hiddenForm, setHiddenForm] = useState(false);
  const [maxGoals, setMaxGoals] = useState(10);
  const [speed, setSpeed] = useState(1);
  const [powerUps, setPoweUps] = useState(false);
  const [error, setError] = useState(false);

  const location = useLocation();
  const inviteFromChat: string | undefined =
    location.state && location.state.invite;
  const [invitation, setInvitation] = useState(!!inviteFromChat);
  const [userInvited, setUserInvited] = useState(inviteFromChat ?? "");

  const navigate = useNavigate();
  const gameSocket = GameSocket.getInstance().socket;
  const MAX_GOALS = 25;
  const MIN_GOALS = 5;
  let waiting = useRef(false);

  useEffect(() => {
    if (testing) console.log("SOCKET GOT MESSAGE");
    if (!waiting.current) {
      gameSocket.off("game_found");
      gameSocket.on("game_found", (gameId) => {
        navigate(`../${gameId}`);
      });
      waiting.current = true;
    }
    return () => {
      waiting.current = false;
      gameSocket.emit("leave_creating_room");
    };
  }, [gameSocket, navigate]);

  useEffect(() => {
    if (testing) console.log("SOCKET GOT MESSAGE");
    if (!waiting.current) {
      gameSocket.off("friend_found");
      gameSocket.on("friend_found", () => {});
      waiting.current = true;
    }
    return () => {
      waiting.current = false;
      gameSocket.emit("leave_private_room");
    };
  }, [gameSocket, navigate]);

  useEffect(() => {
    if (testing) console.log("SOCKET GOT MESSAGE");
    if (!waiting.current) {
      gameSocket.off("friend_not_found");
      gameSocket.on("friend_not_found", () => {
        if (testing) console.log("Friend not found buddy");
      });
    }
  }, [gameSocket]);

  return (
    <>
      <SEO
        title="Pong - Create a game"
        description="Customize your game and start playing."
      />
      <div className="wrapper-matchmaking">
        {!hiddenForm && (
          <>
            <p className="create-game-title">Create a new game!</p>
            <fieldset>
              <label htmlFor="numberOfGoals">Number of Goals (5 - 25)</label>
              <input
                id="numberOfGoals"
                type="number"
                min={MIN_GOALS}
                max={MAX_GOALS}
                value={maxGoals}
                onChange={checkValueLimits}
              />
              <label htmlFor="speedControl">SpeedControl</label>
              <input
                id="speedControl"
                type="range"
                min={0.75}
                max={1.25}
                step={0.01}
                value={speed}
                onChange={(event) => {
                  try {
                    setSpeed(Number(event.target.value));
                  } catch {
                    setSpeed(1);
                  }
                }}
              />
              <label htmlFor="powerUp">PowerUps</label>
              <input
                id="powerUp"
                type="checkbox"
                defaultChecked={powerUps}
                onClick={(event) => {
                  setPoweUps(!powerUps);
                }}
              />
              <label htmlFor="inviteFriend">Invite someone!</label>
              <input
                id="inviteFriend"
                type="checkbox"
                defaultChecked={invitation}
                onClick={(event) => {
                  setInvitation(!invitation);
                }}
              />
              {invitation && (
                <input
                  id="unc-in1"
                  type="text"
                  value={userInvited}
                  placeholder="Invited username"
                  onChange={(e) => setUserInvited(e.target.value)}
                />
              )}
              {error && <>Could not invite user</>}
              {error && (
                <button
                  className="btn game-creation-btn create-game-btn btn-bottom"
                  onClick={(event) => {
                    setError(false);
                  }}
                >
                  OK
                </button>
              )}
            </fieldset>

            <div className="wrapper-row create-game-btns-wrapper">
              <button
                className="btn game-creation-btn btn-bottom-left cancel-game-btn"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                className="btn game-creation-btn btn-bottom-right create-game-btn"
                onClick={(event) => {
                  if (!invitation) {
                    gameSocket.emit("create_room", {
                      speed,
                      maxGoals,
                      powerUps,
                    });
                    waiting.current = false;
                    setHiddenForm(true);
                  } else {
                    createPrivateGame();
                  }
                }}
              >
                Create
              </button>
            </div>
          </>
        )}
        {hiddenForm && (
          <>
            <div className="matchmaking-loader"></div>
            <p className="matchmaking-scaling">
              {!invitation
                ? "Finding new rival for you"
                : `Waiting for ${userInvited} to join`}
            </p>
          </>
        )}
      </div>
    </>
  );

  function createPrivateGame() {
    gameSocket.emit(
      "create_private_room",
      {
        gameDto: {
          speed,
          maxGoals,
          powerUps,
        },
        friendUserName: userInvited,
      },
      (response: any) => {
        if (response === "ok") {
          setHiddenForm(true);
          waiting.current = true;
        } else {
          setError(true);
          waiting.current = false;
        }
      }
    );
  }

  function checkValueLimits(event: React.ChangeEvent<HTMLInputElement>) {
    const value: number = parseInt(event.target.value);
    if (Number.isInteger(value)) {
      if (value > MAX_GOALS) setMaxGoals(MAX_GOALS);
      else if (value < MIN_GOALS) setMaxGoals(MIN_GOALS);
      else setMaxGoals(value);
    }
  }
}
