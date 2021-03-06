import "pathseg";
import "poly-decomp";
import { Vector } from "matter-js";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { Body, BodyTransform } from "./DynamicBody";
import { getSvgPath } from "./getSvgPath";

export interface PathProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  static?: boolean;
  mass?: number;
}

export interface DynamicProps {
  position: BodyTransform;
  onPositionChanged: (transform: BodyTransform) => void;
}

export interface PathState {
  pathData: string;
  vertices: Vector[];
}

export const Path: FC<PathProps & DynamicProps> = ({
  children,
  fill = "transparent",
  stroke = "black",
  strokeWidth = "1px",
  position,
  onPositionChanged,
  mass = 1
}) => {
  const [state, setState] = useState<PathState | null>(null);

  useEffect(() => {
    const [vertices, pathData] = getSvgPath(children);
    setState({
      vertices,
      pathData
    });
  }, [children]);

  if (state == null) {
    return null;
  }
  return (
    <Body
      position={position}
      vertices={state.vertices}
      mass={mass}
      onPositionChanged={onPositionChanged}
    >
      <path
        d={state.pathData}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
      />
    </Body>
  );
};
