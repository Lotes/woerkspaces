import * as React from "react";
import "./styles.css";
import { useSize, Size } from "./useSize";

import { useState, useEffect, useRef, MutableRefObject } from "react";

export default function App() {
  const size = useSize({
    innerWidth: document.body.clientWidth,
    innerHeight: document.body.clientHeight
  });

  return (
    <svg className="App" width={size.innerWidth} height={size.innerHeight}>
      <rect width={size.innerWidth} height={size.innerHeight} fill="blue" />
    </svg>
  );
}
