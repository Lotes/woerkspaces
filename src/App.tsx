import * as React, {useState, useEffect} from "react";
import "./styles.css";
import CANNON from "cannon";
import { useState } from "react";

interface Size {
  innerWidth: number;
  innerHeight: number;
}

function useWorkspaces(initialSize: Size): [Size] {
  const  [size, setSize] = useState(()=>initialSize);

  useEffect(() => {

  });

  return [size];
} //https://github.com/schteppe/cannon.js

export default function App() {
  const [world] = React.useState(() => {
    const w = new CANNON.World();
    w.gravity.set(0, 0, -9.81);
    return w;
  });
  const [transform] = React.useState(() => [
    new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(100, 100, 0),
      shape: new CANNON.Box(new CANNON.Vec3(30, 30, 30))
    })
  ]);
  const [size, setSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  React.useEffect(() => {
    function listener() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  });
  return (
    <svg className="App" width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
    </svg>
  );
}
