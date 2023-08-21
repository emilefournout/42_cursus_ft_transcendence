import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <button
        onClick={() =>
          navigate(location.pathname.replace("changePassword", ""))
        }
      >
        back
      </button>
    </>
  );
}
