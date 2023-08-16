import { Navigate } from "react-router-dom";
import React from "react";

export function Root() {
  return (
    <>
      <Navigate to="/board" />
    </>
  );
}
