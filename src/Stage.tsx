import * as React from "react";
import {
  createContext,
  useContext,
  FC,
  useEffect,
  useState,
  useRef
} from "react";
import { Engine, IEngineDefinition, World } from "matter-js";
import { Size } from "./useSize";

export const EngineContext = createContext<Engine>(null);
export const useEngine = () => useContext(EngineContext);

export type Listener = (dt: number) => void;

export interface IRenderLoop {
  addListener(listener: Listener): void;
  removeListener(listener: Listener): void;
}

export const RenderLoopContext = createContext<RenderLoop | null>(null);
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

export const Stage: FC<StageProps> = ({
  engineOptions,
  children,
  width,
  height
}) => {
  const renderLoopRef = useRef<RenderLoop>();
  const engineRef = useRef<Engine>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const renderLoop = new RenderLoop();
    const engine = Engine.create({
      world: World.create({
        gravity: { x: 0, y: 0.0001, scale: 1 }
      })
    });

    renderLoopRef.current = renderLoop;
    engineRef.current = engine;
    setReady(true);

    (function animate(time: number) {
      requestAnimationFrame(animate);
      Engine.update(engine, 1000 / 60);
      renderLoop.run(time);
    })(0);

    return () => {
      setReady(false);
      if (engineRef.current != null) {
        Engine.clear(engineRef.current!);
        renderLoopRef.current = null;
        engineRef.current = null;
      }
    };
  }, [engineOptions, renderLoopRef, engineRef]);

  return ready ? (
    <EngineContext.Provider value={engineRef.current!}>
      <RenderLoopContext.Provider value={renderLoopRef.current!}>
        <svg width={width} height={height}>
          {children}
        </svg>
      </RenderLoopContext.Provider>
    </EngineContext.Provider>
  ) : null;
};
