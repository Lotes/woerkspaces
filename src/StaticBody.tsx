import "pathseg";
import "poly-decomp";
import {
  Bodies,
  Composite,
  Body as MatterBody,
  IBodyDefinition,
  Vector,
  Vertices
} from "matter-js";
import * as React from "react";
import { FC, useEffect, useState, useRef } from "react";
import { useComposite } from "./Stage";

export interface BodyState {
  ready: boolean;
}

export interface StaticBodyProps {
  vertices: Vector[];
}

export const StaticBody: FC<StaticBodyProps> = ({ vertices, children }) => {
  const composite = useComposite();
  const bodyRef = useRef<MatterBody>();

  const [state, setState] = useState<BodyState>(() => {
    return {
      ready: false
    };
  });

  useEffect(() => {
    if (bodyRef.current) {
      Composite.remove(composite, bodyRef.current);
    }
    const options: IBodyDefinition = {
      isStatic: true
    };
    const centre = Vertices.centre(vertices);
    const body = Bodies.fromVertices(centre.x, centre.y, [vertices], options);
    Composite.add(composite, body);
    bodyRef.current = body;
    setState({
      ready: true
    });
  }, [bodyRef, composite, vertices]);

  if (!state.ready) {
    return null;
  }
  return <>{children}</>;
};
