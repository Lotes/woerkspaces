import * as React from "react";
import "./styles.css";

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

export interface TouchablePaneProps {
  onAddTouch(id: string, point: TouchPoint): void;
  onUpdateTouch(id: string, point: TouchPoint): void;
  onRemoveTouch(id: string): void;
  width: number;
  height: number;
}

export default function TouchablePane({
  width,
  height, 
  children,
  onAddTouch,
  onRemoveTouch,
  onUpdateTouch
}: React.PropsWithChildren<TouchablePaneProps>) {
  return (
    <svg
      width={width}
      height={height}
      onTouchStartCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index) as Touch;
          onAddTouch(
            touch.identifier.toString(),
            toTouchPoint(touch)
          );
        }
      }}
      onTouchMoveCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index) as Touch;
          onUpdateTouch(
            touch.identifier.toString(),
            toTouchPoint(touch)
          );
        }
        t.preventDefault();
      }}
      onTouchCancelCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index);
          onRemoveTouch(
            touch.identifier.toString()
          );
        }
        t.preventDefault();
      }}
      onTouchEndCapture={(t) => {
        for (let index = 0; index < t.changedTouches.length; index++) {
          const touch = t.changedTouches.item(index);
          onRemoveTouch(
            touch.identifier.toString()
          );
        }
        t.preventDefault();
      }}
    >
      {children}
    </svg>
  );
}
