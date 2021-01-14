import * as React from "react";
import "./styles.css";
import { useSize } from "./useSize";

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  return (
    <svg className="App" width={size.width} height={size.height}>
      <rect width={size.width} height={size.height} fill="blue" />
    </svg>
  );
}
