import "pathseg";
import "poly-decomp";
import {
  Bodies,
  Composite,
  Body as MatterBody,
  IBodyDefinition,
  Vertices
} from "matter-js";
import * as React from "react";
import { FC, useEffect, useState, useCallback, useRef } from "react";
import { useComposite, useRenderLoop, RenderEvent } from "./Stage";
import { StaticBodyProps } from "./StaticBody";

export interface BodyTransform {
  x: number;
  y: number;
  angle: number;
  angularVelocity: number;
  vx: number;
  vy: number;
}

interface DynamicBodyState {
  cx: number;
  cy: number;
  ready: boolean;
}

export interface BodyProps extends StaticBodyProps {
  position: BodyTransform;
  onPositionChanged: (position: BodyTransform) => void;
  mass: number;
}

function getBodyTransform(body: MatterBody): BodyTransform {
  return {
    x: body.position.x,
    y: body.position.y,
    angle: body.angle,
    angularVelocity: body.angularVelocity,
    vx: body.velocity.x,
    vy: body.velocity.y
  };
}

function setBodyTransform(body: MatterBody, transform: BodyTransform) {
  MatterBody.setPosition(body, { x: transform.x, y: transform.y });
  MatterBody.setVelocity(body, { x: transform.vx, y: transform.vy });
  MatterBody.setAngle(body, transform.angle);
  MatterBody.setAngularVelocity(body, transform.angularVelocity);
}

function areEqual(a: BodyTransform, b: BodyTransform) {
  return (
    a.x === b.x &&
    a.y === b.y &&
    a.vx === b.vx &&
    a.vy === b.vy &&
    a.angle === b.angle &&
    a.angularVelocity === b.angularVelocity
  );
}

export const Body: FC<BodyProps> = ({
  vertices,
  children,
  position,
  mass,
  onPositionChanged
}) => {
  const json = JSON.stringify(vertices);
  const composite = useComposite();
  const bodyRef = useRef<MatterBody>();

  const [state, setState] = useState<DynamicBodyState>(() => {
    return {
      cx: 0,
      cy: 0,
      ready: false
    };
  });
  const renderLoop = useRenderLoop();

  const b4render = useCallback(() => {
    const current = bodyRef.current;
    if (current != null) {
      setBodyTransform(current, position);
    }
  }, [bodyRef, position]);

  const render = useCallback(() => {
    const current = bodyRef.current;
    if (current != null) {
      const message = getBodyTransform(current);
      if (!areEqual(message, position)) {
        onPositionChanged(message);
      }
    }
  }, [bodyRef, onPositionChanged, position]);

  useEffect(() => {
    let tempPosition: BodyTransform | null = null;
    if (bodyRef.current) {
      tempPosition = getBodyTransform(bodyRef.current);
      Composite.remove(composite, bodyRef.current);
    }
    const options: IBodyDefinition = {
      mass
    };
    const center = Vertices.centre(vertices);
    const body = Bodies.fromVertices(center.x, center.y, [vertices], options);
    if (tempPosition) setBodyTransform(body, tempPosition);
    Composite.add(composite, body);
    bodyRef.current = body;
    setState({
      cx: center.x,
      cy: center.y,
      ready: true
    });
  }, [bodyRef, composite, mass, json]);

  useEffect(() => {
    renderLoop.addListener(RenderEvent.BeforeRender, b4render);
    renderLoop.addListener(RenderEvent.AfterRender, render);

    return () => {
      renderLoop.removeListener(RenderEvent.BeforeRender, b4render);
      renderLoop.removeListener(RenderEvent.AfterRender, render);
    };
  }, [renderLoop, render, b4render]);

  if (!state.ready) {
    return null;
  }
  return (
    <g
      transform={`translate(${position.x} ${position.y}) rotate(${
        (position.angle * 180) / Math.PI
      }) translate(${-state.cx} ${-state.cy})`}
    >
      {children}
    </g>
  );
};
