import React from "react";
import "../Profile.css";
import { useNavigate } from "react-router-dom";

export function Achievements() {
  const navigate = useNavigate();
  return (
    <div id="achievements-card">
      <div className="window-title card-title">Achievements</div>

      <div id="achievements-values" className="card-body">
        <button onClick={() => navigate("/board/user-account/achievements")}>
          Full achievements
        </button>
        ToDo
      </div>
    </div>
  );
}
