import "pathseg";
import { Bodies, Composite, Svg, Body } from "matter-js";
import * as React from "react";
import { FC, useEffect, useState, useCallback, useRef } from "react";
import { useComposite } from "./Body";
import { useRenderLoop } from "./Stage";

export interface XProps {
  x: number;
}

export interface YProps {
  y: number;
}

export interface XYProps extends XProps, YProps {}

export interface DxProps {
  dx: number;
}

export interface DyProps {
  dy: number;
}

export interface CProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export interface cProps {
  dx1: number;
  dy1: number;
  dx2: number;
  dy2: number;
  dx: number;
  dy: number;
}

export interface SProps {
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export interface sProps {
  dx2: number;
  dy2: number;
  dx: number;
  dy: number;
}

export interface QProps {
  x1: number;
  y1: number;
  x: number;
  y: number;
}

export interface qProps {
  dx1: number;
  dy1: number;
  dx: number;
  dy: number;
}

export interface DxDyProps extends DxProps, DyProps {}

export interface ArcProps {
  rx: number;
  ry: number;
  rotation: number;
  largeArc: boolean;
  sweep: boolean;
}

export interface AProps extends ArcProps, XYProps {}

export interface aProps extends ArcProps, DxDyProps {}

type Props =
  | DxDyProps
  | XYProps
  | XProps
  | YProps
  | DxProps
  | DyProps
  | {}
  | CProps
  | cProps
  | SProps
  | sProps
  | QProps
  | qProps
  | AProps
  | aProps;

export const Cmd_M: FC<XYProps> = () => <></>;
export const Cmd_m: FC<DxDyProps> = () => <></>;
export const Cmd_L: FC<XYProps> = () => <></>;
export const Cmd_l: FC<DxDyProps> = () => <></>;

export const Cmd_H: FC<XProps> = () => <></>;
export const Cmd_h: FC<DxProps> = () => <></>;
export const Cmd_V: FC<YProps> = () => <></>;
export const Cmd_v: FC<DyProps> = () => <></>;

export const Cmd_C: FC<CProps> = () => <></>;
export const Cmd_c: FC<cProps> = () => <></>;

export const Cmd_S: FC<SProps> = () => <></>;
export const Cmd_s: FC<sProps> = () => <></>;

export const Cmd_Q: FC<QProps> = () => <></>;
export const Cmd_q: FC<qProps> = () => <></>;

export const Cmd_T: FC<XYProps> = () => <></>;
export const Cmd_t: FC<DxDyProps> = () => <></>;

export const Cmd_A: FC<AProps> = () => <></>;
export const Cmd_a: FC<aProps> = () => <></>;

export const Cmd_Z: FC<{}> = () => <></>;

interface Component {
  type: Function;
  props: Props;
}

export interface PathProps {
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

export interface Transform {
  x: number;
  y: number;
  angle: number;
}

export interface PathState {
  data: string;
  origin: Transform;
  ready: boolean;
}

export const Path: FC<PathProps> = ({
  children,
  fill = "transparent",
  stroke = "black",
  strokeWidth = "1px"
}) => {
  const composite = useComposite();
  const bodyRef = useRef<Body>();
  const [state, setState] = useState<PathState>(() => {
    return {
      data: "z",
      origin: {
        x: 0,
        y: 0,
        angle: 0
      },
      ready: false
    };
  });
  const renderLoop = useRenderLoop();
  const [transform, setTransform] = useState<Transform>(() => ({
    x: 0,
    y: 0,
    angle: 0
  }));
  const render = useCallback(() => {
    return (
      bodyRef.current &&
      setTransform({
        ...bodyRef.current.position,
        angle: bodyRef.current.angle
      })
    );
  }, [bodyRef]);

  useEffect(() => {
    let d: string[] = [];
    React.Children.forEach(children, (child) => {
      const { type, props } = (child as unknown) as Component;
      switch (type) {
        case Cmd_M: {
          const { x, y } = props as XYProps;
          d.push(`M ${x} ${y}`);
          break;
        }

        case Cmd_m: {
          const { dx, dy } = props as DxDyProps;
          d.push(`m ${dx} ${dy}`);
          break;
        }

        case Cmd_L: {
          const { x, y } = props as XYProps;
          d.push(`L ${x} ${y}`);
          break;
        }

        case Cmd_l: {
          const { dx, dy } = props as DxDyProps;
          d.push(`l ${dx} ${dy}`);
          break;
        }

        case Cmd_H: {
          const { x } = props as XProps;
          d.push(`H ${x}`);
          break;
        }

        case Cmd_h: {
          const { dx } = props as DxProps;
          d.push(`h ${dx}`);
          break;
        }

        case Cmd_V: {
          const { y } = props as YProps;
          d.push(`V ${y}`);
          break;
        }

        case Cmd_v: {
          const { dy } = props as DyProps;
          d.push(`v ${dy}`);
          break;
        }

        case Cmd_C: {
          const { x1, y1, x2, y2, x, y } = props as CProps;
          d.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
          break;
        }

        case Cmd_c: {
          const { dx1, dy1, dx2, dy2, dx, dy } = props as cProps;
          d.push(`c ${dx1} ${dy1}, ${dx2} ${dy2}, ${dx} ${dy}`);
          break;
        }

        case Cmd_S: {
          const { x2, y2, x, y } = props as SProps;
          d.push(`S ${x2} ${y2}, ${x} ${y}`);
          break;
        }

        case Cmd_s: {
          const { dx2, dy2, dx, dy } = props as sProps;
          d.push(`s ${dx2} ${dy2}, ${dx} ${dy}`);
          break;
        }

        case Cmd_Q: {
          const { x1, y1, x, y } = props as QProps;
          d.push(`Q ${x1} ${y1}, ${x} ${y}`);
          break;
        }

        case Cmd_q: {
          const { dx1, dy1, dx, dy } = props as qProps;
          d.push(`q ${dx1} ${dy1}, ${dx} ${dy}`);
          break;
        }

        case Cmd_T: {
          const { x, y } = props as XYProps;
          d.push(`T ${x} ${y}`);
          break;
        }

        case Cmd_t: {
          const { dx, dy } = props as DxDyProps;
          d.push(`t ${dx} ${dy}`);
          break;
        }

        case Cmd_A: {
          const { rx, ry, rotation, largeArc, sweep, x, y } = props as AProps;
          d.push(
            `A ${rx} ${ry} ${rotation} ${largeArc ? "1" : "0"} ${
              sweep ? "1" : "0"
            } ${x} ${y}`
          );
          break;
        }

        case Cmd_a: {
          const { rx, ry, rotation, largeArc, sweep, dx, dy } = props as aProps;
          d.push(
            `A ${rx} ${ry} ${rotation} ${largeArc ? "1" : "0"} ${
              sweep ? "1" : "0"
            } ${dx} ${dy}`
          );
          break;
        }

        case Cmd_Z: {
          d.push(`Z`);
          break;
        }
      }
    });
    const joined = d.join(" ");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", joined);

    let transform: Transform = {
      x: 0,
      y: 0,
      angle: 0
    };
    if (bodyRef.current) {
      transform = {
        x: bodyRef.current.position.x,
        y: bodyRef.current.position.y,
        angle: bodyRef.current.angle
      };
      Composite.remove(composite, bodyRef.current);
    }
    const vertices = Svg.pathToVertices(path, 15);
    const body = Bodies.fromVertices(0, 0, [vertices], {
      mass: 1,
      position: {
        x: transform.x,
        y: transform.y
      },
      angle: transform.angle
    });
    Composite.add(composite, body);
    bodyRef.current = body;
    setState({
      data: joined,
      origin: {
        ...body.position,
        angle: body.angle
      },
      ready: true
    });
  }, [children, bodyRef, composite]);

  useEffect(() => {
    renderLoop.addListener(render);

    return () => {
      renderLoop.removeListener(render);
    };
  }, [renderLoop, render]);

  if (!state.ready) {
    return null;
  }
  const x = transform.x - state.origin.x;
  const y = transform.y - state.origin.y;
  const angle = transform.angle - state.origin.angle;
  return (
    <g transform={"translate(" + x + " " + y + ") rotate(" + angle + ")"}>
      <path
        d={state.data}
        strokeWidth={strokeWidth}
        stroke={stroke}
        fill={fill}
      />
    </g>
  );
};
