import * as React from "react";
import { createContext, useContext, FC, useEffect, useState } from "react";
import { Composite as MatterComposite, World } from "matter-js";
import { useEngine } from "./Stage";

export const CompositeContext = createContext<MatterComposite>(null);
export const useComposite = () => useContext(CompositeContext);

export interface CompositeProps {}

export const Composite: FC<CompositeProps> = ({ children }) => {
  const [composite, setComposite] = useState<MatterComposite>();
  const engine = useEngine();

  useEffect(() => {
    const current = MatterComposite.create();
    World.add(engine.world, current);
    setComposite(current);

    return () => {
      World.remove(engine.world, composite);
      MatterComposite.clear(composite);
    };
  }, []);

  return (
    <>
      {composite && (
        <CompositeContext.Provider value={composite}>
          {children}
        </CompositeContext.Provider>
      )}
    </>
  );
};
