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
    (props.type === Visibility.PUBLIC
      ? "btn btn-bottom-left"
      : props.type === Visibility.PRIVATE
      ? "btn btn-bottom-right"
      : "btn") +
    (props.type === props.selected
      ? " vis-btn vis-btn-selected"
      : " vis-btn vis-btn-unselected");
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
