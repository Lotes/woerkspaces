import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";
import { Stage } from "./Stage";
import { Path, Cmd_m, Cmd_t, Cmd_Z } from "./Paths";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  return (
    <Stage width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
      <Path fill="red" strokeWidth="20">
        <Cmd_m dx={100} dy={100} />
        <Cmd_t dx={100} dy={0} />
        <Cmd_t dx={0} dy={100} />
        <Cmd_t dx={-100} dy={0} />
        <Cmd_t dx={0} dy={-100} />
      </Path>
    </Stage>
  );
}
