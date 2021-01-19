import * as React from "react";
import {
  createContext,
  useContext,
  FC,
  useEffect,
  useState,
  useRef
} from "react";
import { Composite as MatterComposite, World } from "matter-js";
import { useEngine } from "./Stage";

export const CompositeContext = createContext<MatterComposite>(null);
export const useComposite = () => useContext(CompositeContext);

export interface CompositeProps {}

export const Composite: FC<CompositeProps> = ({ children }) => {
  const engine = useEngine();
  const compositeRef = useRef<MatterComposite>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (engine != null) {
      const current = MatterComposite.create({});
      World.add(engine.world, current);
      compositeRef.current = current;
      setReady(true);
    }

    return () => {
      if (compositeRef.current != null) {
        setReady(false);
        World.remove(engine.world, compositeRef.current);
        MatterComposite.clear(compositeRef.current);
        compositeRef.current = null;
      }
    };
  }, [compositeRef, engine]);

  return ready ? (
    <CompositeContext.Provider value={compositeRef.current}>
      {children}
    </CompositeContext.Provider>
  ) : null;
};