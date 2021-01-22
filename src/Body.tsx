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
import { FC, useEffect, useState, useCallback, useRef } from "react";
import { useComposite, useRenderLoop } from "./Stage";

export interface BodyState {
  cx: number;
  cy: number;
  ready: boolean;
}

export interface BodyTransform {
  x: number;
  y: number;
  angle: number;
  vx: number;
  vy: number;
}

export interface BodyProps {
  x?: number;
  y?: number;
  angle?: number;
  vx?: number;
  vy?: number;
  mass: number;
  vertices: Vector[];
  static?: boolean;
  onPositionChange?: (transform: BodyTransform) => void;
}

function body2Transform(body: MatterBody): BodyTransform {
  return {
    x: body.position.x,
    y: body.position.y,
    angle: body.angle,
    vx: body.velocity.x,
    vy: body.velocity.y
  };
}

function setBodyTransform(body: MatterBody, transform: BodyTransform) {
  MatterBody.setPosition(body, { x: transform.x, y: transform.y });
  MatterBody.setAngle(body, transform.angle);
  MatterBody.setVelocity(body, { x: transform.vx, y: transform.vy });
}

export const Body: FC<BodyProps> = ({
  vertices,
  children,
  angle = 0,
  x = 0,
  y = 0,
  vx = 0,
  vy = 0,
  static: isStatic = false,
  mass,
  onPositionChange = () => {}
}) => {
  const composite = useComposite();
  const bodyRef = useRef<MatterBody>();

  const [state, setState] = useState<BodyState>(() => {
    return {
      cx: 0,
      cy: 0,
      ready: false
    };
  });
  const [transform, setTransform] = useState<BodyTransform>(() => {
    return {
      x,
      y,
      vx,
      vy,
      angle
    };
  });

  const renderLoop = useRenderLoop();
  const render = useCallback(() => {
    const current = bodyRef.current;
    if (current != null) {
      const message = body2Transform(current);
      setTransform(message);
      onPositionChange(message);
    }
  }, [bodyRef, onPositionChange]);

  useEffect(() => {
    if (bodyRef.current) {
      Composite.remove(composite, bodyRef.current);
    }
    const options: IBodyDefinition = {
      mass
    };
    if (isStatic) {
      options.isStatic = true;
    }
    const center = Vertices.centre(vertices);
    const body = Bodies.fromVertices(center.x, center.y, [vertices], options);
    Composite.add(composite, body);
    bodyRef.current = body;
    setState({
      cx: body.position.x,
      cy: body.position.y,
      ready: true
    });
  }, [
    children,
    bodyRef,
    composite,
    isStatic,
    vertices,
    state.cx,
    state.cy,
    mass
  ]);

  useEffect(() => {
    renderLoop.addListener(render);

    return () => {
      renderLoop.removeListener(render);
    };
  }, [renderLoop, render]);

  if (!state.ready) {
    return null;
  }
  return (
    <g
      transform={`translate(${transform.x} ${transform.y}) rotate(${
        (transform.angle * 180) / Math.PI
      }) translate(${-state.cx} ${-state.cy})`}
    >
      {children}
    </g>
  );
};
