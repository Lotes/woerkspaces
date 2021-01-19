import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";
import { Stage } from "./Stage";
import { Path, Mr, Tr } from "./Paths";
import { Composite } from "./Body";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  return (
    <Stage width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
      <Composite>
        <Path fill="red" strokeWidth="20">
          <Mr dx={100} dy={100} />
          <Tr dx={100} dy={0} />
          <Tr dx={0} dy={100} />
          <Tr dx={-100} dy={0} />
          <Tr dx={0} dy={-100} />
        </Path>
      </Composite>
    </Stage>
  );
}
