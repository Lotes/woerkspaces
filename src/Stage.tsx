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
import { Composite as MatterComposite } from "matter-js";
import TouchablePane from "./TouchablePane";
import { MultiTouchConstraint } from "./MultiTouchConstraint";

export const EngineContext = createContext<Engine>(Engine.create({}));
export const useEngine = () => useContext(EngineContext);

export const CompositeContext = createContext<MatterComposite>(MatterComposite.create({}));
export const useComposite = () => useContext(CompositeContext);

export type Listener = (dt: number) => void;

export enum RenderEvent {
  BeforeRender = "before",
  AfterRender = "after"
}

export interface IRenderLoop {
  addListener(event: RenderEvent, listener: Listener): void;
  removeListener(event: RenderEvent, listener: Listener): void;
}

interface RenderListenerMap {
  [name: string]: Listener[];
}

export class RenderLoop implements IRenderLoop {
  private listeners: RenderListenerMap = {};
  constructor() {
    this.listeners[RenderEvent.AfterRender] = [];
    this.listeners[RenderEvent.BeforeRender] = [];
  }
  addListener(event: RenderEvent, listener: Listener) {
    this.listeners[event].push(listener);
  }
  removeListener(event: RenderEvent, listener: Listener) {
    this.listeners[event] = this.listeners[event].filter((i) => i !== listener);
  }
  run(event: RenderEvent, time: number) {
    this.listeners[event].forEach((ls) => ls(time));
  }
}

export const RenderLoopContext = createContext<RenderLoop>(new RenderLoop());
export const useRenderLoop = () => useContext(RenderLoopContext);

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
  const multiTouchConstraintRef = useRef<MultiTouchConstraint>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const renderLoop = new RenderLoop();
    const engine = Engine.create({
      world: World.create({
        gravity: { x: 0, y:0.001, scale: 1 }
      })
    });
    const multiTouchConstraint  = new MultiTouchConstraint(engine);

    renderLoopRef.current = renderLoop;
    engineRef.current = engine;
    multiTouchConstraintRef.current = multiTouchConstraint;
    setReady(true);

    (function animate() {
      renderLoop.run(RenderEvent.BeforeRender, 0);
      multiTouchConstraintRef.current!.refresh();
      Engine.update(engine, 1000 / 60);
      renderLoop.run(RenderEvent.AfterRender, 0);
      requestAnimationFrame(animate);
    })();

    return () => {
      setReady(false);
      if (engineRef.current != null) {
        Engine.clear(engineRef.current!);
      }
    };
  }, [engineOptions, renderLoopRef, engineRef]);

  return ready ? (
    <EngineContext.Provider value={engineRef.current!}>
      <RenderLoopContext.Provider value={renderLoopRef.current!}>
        <CompositeContext.Provider value={engineRef.current!.world}>
          <TouchablePane 
            onAddTouch={(id, touch) => multiTouchConstraintRef.current!.add(id, touch)}
            onRemoveTouch={(id) => multiTouchConstraintRef.current!.remove(id)}
            onUpdateTouch={(id, touch) => multiTouchConstraintRef.current!.update(id, touch)}
            width={width} 
            height={height}>
            {children}
          </TouchablePane>
        </CompositeContext.Provider>
      </RenderLoopContext.Provider>
    </EngineContext.Provider>
  ) : null;
};

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
        MatterComposite.clear(compositeRef.current, false);
      }
    };
  }, [compositeRef, engine]);

  return ready ? (
    <CompositeContext.Provider value={compositeRef.current!}>
      {children}
    </CompositeContext.Provider>
  ) : null;
};
