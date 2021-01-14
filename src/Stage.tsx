import * as React from "react";
import { createContext, useContext, FC, useEffect, createRef } from "react";
import { Engine, IEngineDefinition, Runner } from "matter-js";
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
  const runner = createRef<Runner>();

  useEffect(() => {
    engine.current = Engine.create(engineOptions || {});
    runner.current = Runner.create();
    return () => {
      Runner.stop(runner.current);
      Engine.clear(engine.current);
    };
  }, [engineOptions, engine, runner]);

  return (
    <EngineContext.Provider value={engine.current}>
      <svg width={width} height={height}>
        {children}
      </svg>
    </EngineContext.Provider>
  );
};
