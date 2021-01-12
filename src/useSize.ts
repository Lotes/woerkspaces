import { useState, useEffect } from "react";

export interface Size {
  innerWidth: number;
  innerHeight: number;
}

export function useSize(initialSize: Size) {
  const [size, setSize] = useState(() => initialSize);

  useEffect(() => {
    function listener() {
      setSize({
        innerHeight: document.body.clientHeight,
        innerWidth: document.body.clientWidth
      });
    }
    window.addEventListener("resize", listener);

    return () => window.removeEventListener("resize", listener);
  }, []);

  return size;
}
