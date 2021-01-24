import "pathseg";
import "poly-decomp";
import { Svg, Vector } from "matter-js";
import * as React from "react";
import { FC } from "react";

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

export const M: FC<XYProps> = () => <></>;
export const Mr: FC<DxDyProps> = () => <></>;
export const L: FC<XYProps> = () => <></>;
export const Lr: FC<DxDyProps> = () => <></>;

export const H: FC<XProps> = () => <></>;
export const Hr: FC<DxProps> = () => <></>;
export const V: FC<YProps> = () => <></>;
export const Vr: FC<DyProps> = () => <></>;

export const C: FC<CProps> = () => <></>;
export const Cr: FC<cProps> = () => <></>;

export const S: FC<SProps> = () => <></>;
export const Sr: FC<sProps> = () => <></>;

export const Q: FC<QProps> = () => <></>;
export const Qr: FC<qProps> = () => <></>;

export const T: FC<XYProps> = () => <></>;
export const Tr: FC<DxDyProps> = () => <></>;

export const A: FC<AProps> = () => <></>;
export const Ar: FC<aProps> = () => <></>;

export const Z: FC<{}> = () => <></>;

interface Component {
  type: Function;
  props: Props;
}

export interface PathState {
  pathData: string;
  vertices: Vector[];
}

export function getSvgPath(children?: React.ReactNode) {
  let d: string[] = [];
  React.Children.forEach(children, (child) => {
    const { type, props } = (child as unknown) as Component;
    switch (type) {
      case M: {
        const { x, y } = props as XYProps;
        d.push(`M ${x} ${y}`);
        break;
      }

      case Mr: {
        const { dx, dy } = props as DxDyProps;
        d.push(`m ${dx} ${dy}`);
        break;
      }

      case L: {
        const { x, y } = props as XYProps;
        d.push(`L ${x} ${y}`);
        break;
      }

      case Lr: {
        const { dx, dy } = props as DxDyProps;
        d.push(`l ${dx} ${dy}`);
        break;
      }

      case H: {
        const { x } = props as XProps;
        d.push(`H ${x}`);
        break;
      }

      case Hr: {
        const { dx } = props as DxProps;
        d.push(`h ${dx}`);
        break;
      }

      case V: {
        const { y } = props as YProps;
        d.push(`V ${y}`);
        break;
      }

      case Vr: {
        const { dy } = props as DyProps;
        d.push(`v ${dy}`);
        break;
      }

      case C: {
        const { x1, y1, x2, y2, x, y } = props as CProps;
        d.push(`C ${x1} ${y1}, ${x2} ${y2}, ${x} ${y}`);
        break;
      }

      case Cr: {
        const { dx1, dy1, dx2, dy2, dx, dy } = props as cProps;
        d.push(`c ${dx1} ${dy1}, ${dx2} ${dy2}, ${dx} ${dy}`);
        break;
      }

      case S: {
        const { x2, y2, x, y } = props as SProps;
        d.push(`S ${x2} ${y2}, ${x} ${y}`);
        break;
      }

      case Sr: {
        const { dx2, dy2, dx, dy } = props as sProps;
        d.push(`s ${dx2} ${dy2}, ${dx} ${dy}`);
        break;
      }

      case Q: {
        const { x1, y1, x, y } = props as QProps;
        d.push(`Q ${x1} ${y1}, ${x} ${y}`);
        break;
      }

      case Qr: {
        const { dx1, dy1, dx, dy } = props as qProps;
        d.push(`q ${dx1} ${dy1}, ${dx} ${dy}`);
        break;
      }

      case T: {
        const { x, y } = props as XYProps;
        d.push(`T ${x} ${y}`);
        break;
      }

      case Tr: {
        const { dx, dy } = props as DxDyProps;
        d.push(`t ${dx} ${dy}`);
        break;
      }

      case A: {
        const { rx, ry, rotation, largeArc, sweep, x, y } = props as AProps;
        d.push(
          `A ${rx} ${ry} ${rotation} ${largeArc ? "1" : "0"} ${
            sweep ? "1" : "0"
          } ${x} ${y}`
        );
        break;
      }

      case Ar: {
        const { rx, ry, rotation, largeArc, sweep, dx, dy } = props as aProps;
        d.push(
          `A ${rx} ${ry} ${rotation} ${largeArc ? "1" : "0"} ${
            sweep ? "1" : "0"
          } ${dx} ${dy}`
        );
        break;
      }

      case Z: {
        d.push(`Z`);
        break;
      }
    }
  });
  const joined = d.join(" ");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", joined);

  const pathAsVertices = Svg.pathToVertices(path, 15);
  return [pathAsVertices, joined];
}
