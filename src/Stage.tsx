import { createContext, useContext, FC, useEffect, createRef } from "react";
import { Engine, IEngineDefinition } from "matter-js";
import { Size } from "./useSize";

export const EngineContext = createContext<Engine>(null);
export const useEngine = () => useContext(EngineContext);

export interface StageProps extends Size {
  engineOptions?: IEngineDefinition;
}

export const Stage: FC<StageProps> = ({
  engineOptions,
  children,
  width,
  height
}) => {
  const engine = createRef<Engine>();

  useEffect(() => {
    engine.current = Engine.create(engineOptions || {});
    return () => Engine.clear(engine.current);
  }, [engineOptions, engine]);

  return (
    <EngineContext.Provider value={engine.current}>
      <svg width={width} height={height}>
        {children}
      </svg>
    </EngineContext.Provider>
  );
};
