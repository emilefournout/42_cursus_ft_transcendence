import React, { useState } from "react";
import { Slider } from "@mui/material";

interface MuteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  mute: (time: number) => void;
}
export function MuteDialog(props: MuteDialogProps) {
  const [value, setValue] = useState(30);
  const close = () => {
    props.setOpen(false);
  };

  return (
    <div>
      <dialog open={props.open}>
        {value} minutes
        <Slider
          aria-label="Volume"
          value={value}
          onChange={(e, newValue) => setValue(newValue as number)}
          min={15}
          max={90}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "25px",
          }}
        >
          <button onClick={close}>cancel</button>
          <button onClick={() => props.mute(value * 60000)}>mute</button>
        </div>
      </dialog>
    </div>
  );
}
