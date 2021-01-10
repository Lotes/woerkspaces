import * as React from "react";
import "./styles.css";
import CANNON from "cannon";
import { useState, useEffect, useCallback } from "react";

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

function useWoerkspaces(initialSize: Size): [Size] {
  const [size, setSize] = useState(() => initialSize);
  const [spaces, setSpaces] = useState<Woerkspace[]>(() => []);
  const add = useRef<AddAction>(null);

  useEffect(() => {
    function listener() {
      setSize(window);
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

    add.current = woerkspace => {
      var boxBody = new CANNON.Body({
        mass: 5,
        position: new CANNON.Vec3(0, 0, 10),
        shape: new CANNON.Box(woerkspace.width, woerkspace.height, 0.1)
      });
      world.addBody(boxBody);
      bodies.push(boxBody);
    };

    const fixedTimeStep = 1.0 / 60.0;
    const maxSubSteps = 3;

    let lastTime: number;
    (function simloop(time: number){
      requestAnimationFrame(simloop);
      if(lastTime !== undefined) {
        var dt = (time - lastTime) / 1000;
        world.step(fixedTimeStep, dt, maxSubSteps);
      } 
      lastTime = time;
    })();

    return () => window.removeEventListener("resize", listener);
  });
  
  return [size, spaces, add.current ];
}

export default function App() {
  const [size, spaces, add] = useWoerkspaces(window);
  
  useEffect(() => {
    add({
      cx: 100,
      cy: 100,
      width: 60,
      height: 40,
      angle: 0,
      color: "red"
    })
  });

  return (
    <svg className="App" width={size.width} height={size.height}>
      <rect width={size.innerWidth} height={size.innerHeight} fill="blue" />
      {spaces.map(s => {
        return (
          <g transform={ˋtranslate(${s.cx - s.width/2} ${s.cy - s.height/2}) rotate(${s.angle})ˋ}>
            <rect
              width={s.width}
              height={s.height}
              fill={s.color}
            />
          </g>
        );
      })}
    </svg>
  );
}
