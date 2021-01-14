import { useState, useEffect } from "react";

export interface Size {
  width: number;
  height: number;
}

export type SizeGetter = () => Size;

export function useSize(getSize: SizeGetter) {
  const [size, setSize] = useState(getSize);

  useEffect(() => {
    function listener() {
      setSize(getSize());
    }
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  });

  return size;
}
