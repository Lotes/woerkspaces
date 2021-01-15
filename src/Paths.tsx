import * as React from "react";
import { FC, useEffect, useState } from "react";

export enum Command {
  ArcTo,
  HorizontalLineTo,
  VerticalLineTo,
  Close,
  Cubic,
  SymetricCubic,
  Quadratic,
  SymetricQuadratic
}

export interface PathItemBase {
  absolute?: boolean;
}

export interface MoveToProps extends PathItemBase {
  x: number;
  y: number;
}

export interface LineToProps extends PathItemBase {
  x: number;
  y: number;
}

export const MoveTo: FC<MoveToProps> = () => <></>;
export const LineTo: FC<LineToProps> = () => <></>;

interface Component {
  type: Function;
  props: {};
}

export interface PathProps {}

export const Path: FC<PathProps> = ({ children }) => {
  const [data, setData] = useState(() => "");

  useEffect(() => {
    let d: string[] = [];
    React.Children.forEach(children, (child) => {
      const { type, props } = (child as unknown) as Component;
      switch (type) {
        case MoveTo: {
          const { x, y, absolute } = props as MoveToProps;
          const m = absolute ? "M" : "m";
          d.push(`${m} ${x} ${y}`);
          break;
        }

        case LineTo: {
          const { x, y, absolute } = props as LineToProps;
          const l = absolute ? "L" : "l";
          d.push(`${l} ${x} ${y}`);
          break;
        }
      }
    });
    setData(d.join(" "));
  }, [children]);

  return <path d={data} stroke="black" />;
};
