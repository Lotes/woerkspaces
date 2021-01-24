import "pathseg";
import "poly-decomp";
import { Vector } from "matter-js";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { getSvgPath } from "./getSvgPath";
import { StaticBody } from "./StaticBody";

export interface PathProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  static?: boolean;
  mass?: number;
}

export interface PathState {
  pathData: string;
  vertices: Vector[];
}

export const Static: FC<PathProps> = ({
  children,
  fill = "transparent",
  stroke = "black",
  strokeWidth = "1px",
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
    <StaticBody vertices={state.vertices}>
      <path
        d={state.pathData}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
      />
    </StaticBody>
  );
};
