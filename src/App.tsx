import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";
import { Stage } from "./Stage";
import { Path } from "./Paths";
import { Static } from "./Static";
import { Mr, Lr, Z, Hr, Vr } from "./getSvgPath";
import { BodyTransform } from "./DynamicBody";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));
  const [position, setPosition] = React.useState<BodyTransform>(() => ({
    x: 100,
    y: 100,
    vx: 0,
    vy: 0,
    angle: 0,
    angularVelocity:0
  }));

  return (
    <Stage width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
      <Path
        position={position}
        fill="red"
        strokeWidth="1"
        onPositionChanged={setPosition}
      >
        <Mr dx={100} dy={100} />
        <Lr dx={0} dy={100} />
        <Lr dx={100} dy={-100} />
        <Lr dx={0} dy={-10} />
        <Z />
      </Path>
      <Static fill="green" strokeWidth="1">
        <Mr dx={0} dy={size.height} />
        <Hr dx={size.width} />
        <Vr dy={40} />
        <Hr dx={-size.width} />
        <Z />
      </Static>
      <Static fill="green" strokeWidth="1">
        <Mr dx={0} dy={0} />
        <Hr dx={size.width} />
        <Vr dy={-40} />
        <Hr dx={-size.width} />
        <Z />
      </Static>
      <Static fill="green" strokeWidth="1">
        <Mr dx={-40} dy={0} />
        <Hr dx={40} />
        <Vr dy={size.height} />
        <Hr dx={-40} />
        <Z />
      </Static>
      <Static fill="green" strokeWidth="1">
        <Mr dx={size.width} dy={0} />
        <Hr dx={40} />
        <Vr dy={size.height} />
        <Hr dx={-40} />
        <Z />
      </Static>
    </Stage>
  );
}
