import React from "react";
import { RequestType } from "../../UserProfilePage";
import { ProfileBarContext } from "../ProfileLeftBar";

interface RequestTypeButtonProps {
  type: RequestType;
}
export function RequestTypeButton(props: RequestTypeButtonProps) {
  const profileBarContext = React.useContext(ProfileBarContext);
  const setRequestType = () => {
    if (profileBarContext === undefined) return;

    props.type === RequestType.enabled
      ? profileBarContext.setRequestsType(RequestType.enabled)
      : profileBarContext.setRequestsType(RequestType.pending);
  };
  if (profileBarContext === undefined) return <></>;
  else {
    return (
      <>
        <button
          onClick={setRequestType}
          style={
            props.type === profileBarContext.requestsType
              ? { color: "var(--Mooned-Teal)" }
              : {}
          }
        >
          {props.type === RequestType.enabled ? <>Accepted</> : <>Pending</>}
        </button>
      </>
    );
  }
}
