import * as React from "react";
import "./styles.css";
import { useSize, Size } from "./useSize";
import CANNON from "cannon";
import { useState, useEffect, useRef, MutableRefObject } from "react";

interface Woerkspace {
  id?: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
  angle: number;
  color: string;
}

type AddAction = (woerkspace: Woerkspace) => void;

function useWoerkspaces(
  size: Size
): [Woerkspace[], MutableRefObject<AddAction>] {
  const [spaces, setSpaces] = useState<Woerkspace[]>(() => []);
  const add = useRef<AddAction>();

  useEffect(() => {
    let id = 0;
    const bodies = new Map<CANNON.Body, Woerkspace>();
    const world = new CANNON.World();
    world.gravity.set(0, 0, -9.82);

    var groundBody = new CANNON.Body({
      mass: 0
    });
    var groundShape = new CANNON.Plane();
    groundBody.addShape(groundShape);
    world.addBody(groundBody);

    add.current = (woerkspace: Woerkspace) => {
      const position = new CANNON.Vec3(woerkspace.cx, woerkspace.cy, 10);
      const shape = new CANNON.Box(
        new CANNON.Vec3(woerkspace.width / 2, woerkspace.height / 2, 0.1)
      );
      const boxBody = new CANNON.Body({
        mass: 5,
        position,
        shape
      });
      world.addBody(boxBody);
      bodies.set(boxBody, { ...woerkspace, id });
      id++;
    };

    const fixedTimeStep = 1.0 / 60.0;
    const maxSubSteps = 3;

    let lastTime: number | undefined;
    (function simloop() {
      const time = new Date().getTime();
      requestAnimationFrame(simloop);
      if (lastTime !== undefined) {
        var dt = (time - lastTime) / 1000;

        world.step(fixedTimeStep, dt, maxSubSteps);
      }

      const result: Woerkspace[] = [];
      bodies.forEach((value, key) => {
        let element = {
          ...value,
          cx: key.position.x,
          cy: key.position.y,
          angle: Math.acos(key.quaternion.w) * 2
        };
        result.push(element);
      });
      setSpaces(result);

      lastTime = time;
    })();
  }, []);

  return [spaces, add];
}

export default function App() {
  const size = useSize({
    innerWidth: document.body.clientWidth,
    innerHeight: document.body.clientHeight
  });
  const [spaces, add] = useWoerkspaces(size);

  useEffect(() => {
    add.current({
      cx: 100,
      cy: 100,
      width: 60,
      height: 40,
      angle: 0,
      color: "red"
    });
  });

  return (
    <svg className="App" width={size.innerWidth} height={size.innerHeight}>
      <rect width={size.innerWidth} height={size.innerHeight} fill="blue" />
      {spaces.map((s) => {
        const transform = `translate(${s.cx - s.width / 2} ${
          s.cy - s.height / 2
        }) rotate(${s.angle})`;
        return (
          <g key={s.id} transform={transform}>
            <rect width={s.width} height={s.height} fill={s.color} />
          </g>
        );
      })}
    </svg>
  );
}
