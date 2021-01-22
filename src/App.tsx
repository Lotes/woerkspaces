import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";
import { Stage } from "./Stage";
import { Path, Mr, Lr, Z, Hr, Vr } from "./Paths";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  return (
    <Stage width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
      <Path fill="red" strokeWidth="1">
        <Mr dx={10} dy={10} />
        <Lr dx={0} dy={100} />
        <Lr dx={100} dy={-100} />
        <Lr dx={0} dy={-10} />
        <Z />
      </Path>
      <Path static fill="green" strokeWidth="1">
        <Mr dx={0} dy={size.height} />
        <Hr dx={size.width} />
        <Vr dy={40} />
        <Hr dx={-size.width} />
        <Z />
      </Path>
      <Path static fill="green" strokeWidth="1">
        <Mr dx={0} dy={0} />
        <Hr dx={size.width} />
        <Vr dy={-40} />
        <Hr dx={-size.width} />
        <Z />
      </Path>
      <Path static fill="green" strokeWidth="1">
        <Mr dx={-40} dy={0} />
        <Hr dx={40} />
        <Vr dy={size.height} />
        <Hr dx={-40} />
        <Z />
      </Path>
      <Path static fill="green" strokeWidth="1">
        <Mr dx={size.width} dy={0} />
        <Hr dx={40} />
        <Vr dy={size.height} />
        <Hr dx={-40} />
        <Z />
      </Path>
    </Stage>
  );
}
