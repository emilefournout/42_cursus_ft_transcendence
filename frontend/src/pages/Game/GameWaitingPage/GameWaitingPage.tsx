import React, { FunctionComponent } from "react";
interface Props {
  message: String;
}
export function GameWaitingPage({ message }: Props) {
  return (
    <>
      {message}
      {/*button cancel*/}
    </>
  );
}
