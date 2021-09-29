import * as React from "react";
import { useReducer } from "react";
import "./styles.css";
import { useSize } from "./useSize";

export interface TouchPoint {
  x: number;
  y: number;
  rotation: number;
  radiusX: number;
  radiusY: number;
  force: number;
}

export interface State {
  [id: string]: TouchPoint;
}

export enum ActionType {
  Add,
  Change,
  Remove
}

export interface ActionBase {
  type: ActionType;
  id: string;
  point?: TouchPoint;
}

export interface ActionAdd extends ActionBase {
  type: ActionType.Add;
  id: string;
  point: TouchPoint;
}

export interface ActionChange extends ActionBase {
  type: ActionType.Change;
  id: string;
  point: TouchPoint;
}

export interface ActionRemove extends ActionBase {
  type: ActionType.Remove;
  id: string;
}

export type Action = ActionAdd | ActionChange | ActionRemove;

function reduce(state: State, action: Action): State {
  switch (action.type) {
    case ActionType.Add:
    case ActionType.Change:
      return {
        ...state,
        [action.id]: action.point
      };
    case ActionType.Remove:
      const copy = {
        ...state
      };
      delete copy[action.id];
      return copy;
  }
  return state;
}

function toTouchPoint(t: Touch): TouchPoint {
  return {
    x: t.clientX,
    y: t.clientY,
    radiusX: t.radiusX,
    radiusY: t.radiusY,
    rotation: t.rotationAngle,
    force: t.force
  };
}

export default function App() {
  const size = useSize(() => ({
    width: document.body.clientWidth,
    height: document.body.clientHeight
  }));

  const [state, dispatch] = useReducer(reduce, {});
  const list = Object.getOwnPropertyNames(state).map((n) => state[n]);

  return (
    <svg
      width={size.width}
      height={size.height}
      onTouchStartCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index) as Touch;
          dispatch({
            type: ActionType.Add,
            id: touch.identifier.toString(),
            point: toTouchPoint(touch)
          });
        }
      }}
      onTouchMoveCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index) as Touch;
          dispatch({
            type: ActionType.Change,
            id: touch.identifier.toString(),
            point: toTouchPoint(touch)
          });
        }
      }}
      onTouchCancelCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index);
          dispatch({
            type: ActionType.Remove,
            id: touch.identifier.toString(),
          });
        }
      }}
      onTouchEndCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index);
          dispatch({
            type: ActionType.Remove,
            id: touch.identifier.toString()
          });
        }
      }}
    >
      <rect width={size.width} height={size.height} fill="blue" />
      {list.map((point, index) => {
        return (
          <g
            key={index}
            transform={
              "translate(" +
              point.x +
              " " +
              point.y +
              ") rotate(" +
              (point.rotation * 180) / Math.PI +
              ")"
            }
          >
            <ellipse
              cx="0"
              cy="0"
              rx={point.radiusX}
              ry={point.radiusY}
              fill={"rgb(" + Math.round(point.force * 255) + ",0,0)"}
            />
          </g>
        );
      })}
    </svg>
  );
}
