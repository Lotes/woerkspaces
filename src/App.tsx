import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";
import { Stage } from "./Stage";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  return (
    <Stage width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
    </Stage>
  );
}
