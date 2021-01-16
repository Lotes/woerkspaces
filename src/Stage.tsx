import * as React from "react";
import { createContext, useContext, FC, useEffect, useState } from "react";
import { Engine, IEngineDefinition, Runner } from "matter-js";
import { Size } from "./useSize";

export const EngineContext = createContext<Engine>(null);
export const useEngine = () => useContext(EngineContext);

export type Listener = (dt: number) => void;

export interface IRenderLoop {
  addListener(listener: Listener);
  removeListener(listener: Listener);
}

export const RenderLoopContext = createContext<IRenderLoop>(null);
export const useRenderLoop = () => useContext(RenderLoopContext);

export class RenderLoop implements IRenderLoop {
  private listeners: Listener[] = [];
  addListener(listener: Listener) {
    this.listeners.push(listener);
  }
  removeListener(listener: Listener) {
    this.listeners = this.listeners.filter((i) => i !== listener);
  }
  run(time: number) {
    this.listeners.forEach((ls) => ls(time));
  }
}

export interface StageProps extends Size {
  engineOptions?: IEngineDefinition;
}

export interface StageState {
  engine: Engine;
  runner: Runner;
  renderLoop: RenderLoop;
}

export const Stage: FC<StageProps> = ({
  engineOptions,
  children,
  width,
  height
}) => {
  const [state, setState] = useState<StageState | null>(null);

  useEffect(() => {
    const engine = Engine.create(engineOptions || {});
    const runner = Runner.create();
    const renderLoop = new RenderLoop();
    setState({
      engine,
      runner,
      renderLoop
    });

    (function animate(time: number) {
      if (runner.enabled) {
        requestAnimationFrame(animate);
      }
      renderLoop.run(time);
    })(0);

    return () => {
      Runner.stop(state?.runner);
      Engine.clear(state?.engine);
    };
  }, []);

  return (
    <>
      {state && (
        <EngineContext.Provider value={state.engine}>
          <RenderLoopContext.Provider value={state.renderLoop}>
            <svg width={width} height={height}>
              {children}
            </svg>
          </RenderLoopContext.Provider>
        </EngineContext.Provider>
      )}
    </>
  );
};
