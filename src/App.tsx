import * as React from "react";
import "./styles.css";
import CANNON from "cannon";
import { useState, useEffect, useRef, MutableRefObject } from "react";

interface Size {
  innerWidth: number;
  innerHeight: number;
}

interface Woerkspace {
  cx: number;
  cy: number;
  width: number;
  height: number;
  angle: number;
  color: string;
}

type AddAction = (woerkspace: Woerkspace) => void;

function useWoerkspaces(
  initialSize: Size
): [Size, Woerkspace[], MutableRefObject<AddAction>] {
  const [size, setSize] = useState(() => initialSize);
  const [spaces, setSpaces] = useState<Woerkspace[]>(() => []);
  const add = useRef<AddAction>();

  useEffect(() => {
    function listener() {
      setSize({
        innerHeight: document.body.innerHeight,
        innerWidth: document.body.innerWidth
      });
    }
    window.addEventListener("resize", listener);

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
      bodies.set(boxBody, woerkspace);
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

    return () => window.removeEventListener("resize", listener);
  }, []);

  return [size, spaces, add];
}

export default function App() {
  const [size, spaces, add] = useWoerkspaces(window);

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
          <g transform={transform}>
            <rect width={s.width} height={s.height} fill={s.color} />
          </g>
        );
      })}
    </svg>
  );
}
