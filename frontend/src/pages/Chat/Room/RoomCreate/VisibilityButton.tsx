import React from "react";
import { Visibility } from "./RoomCreate";
import "./VisibilityButton.css";
export interface VisibilityButtonProps {
  type: Visibility;
  selected: Visibility;
  typeCallback: (type: Visibility) => void;
  clearCallback: () => void;
}
export function VisibilityButton(props: VisibilityButtonProps) {
  const buttonSizeClass: string =
    props.type === props.selected ? "btn-large" : "btn-small";
  const text: string = props.type.toString();

  const update = () => {
    props.typeCallback(props.type);
    if (props.type !== Visibility.PROTECTED) {
      props.clearCallback();
    }
  };
  return (
    <div className={buttonSizeClass} onClick={() => update()}>
      {text}
    </div>
  );
}
