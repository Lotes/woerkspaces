import { Body, Engine, Vertices, Sleeping, Constraint, Composite, Bounds, Vector } from "matter-js";
import { TouchPoint } from "./TouchablePane";

interface Touch {
    initialPosition: TouchPoint;
    lastPosition: TouchPoint;
    constraint: Constraint;
    body: Body;
}

interface TouchMap {
    [id: string]: Touch;
}

export class MultiTouchConstraint {
    private engine: Engine;
    private touches: TouchMap = {};
    
    constructor(engine: Engine) {
        this.engine = engine
    }
    
    add(id: string, point: TouchPoint) { 
        const position = Vector.create(point.x, point.y);
        const bodies = Composite.allBodies(this.engine.world);
        for (var i = 0; i < bodies.length; i++) {
            const body = bodies[i];
            if (Bounds.contains(body.bounds, position)) {
                for (var j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
                    var part = body.parts[j];
                    if (Vertices.contains(part.vertices, position)) {
                        var constraint = Constraint.create({ 
                            label: 'Touch Constraint: '+id,
                            pointA: position,
                            pointB: Vector.sub(position,position),
                            bodyB: body,
                            stiffness: 0.6,
                            length: 0,
                        });
                        Composite.add(this.engine.world, constraint);
                        this.touches[id] = {
                            constraint,
                            body,
                            initialPosition: {...point},
                            lastPosition: {...point},
                        };
                        Sleeping.set(body, false);
                        break;
                    }
                }
            }
        }
    }
    update(id: string, point: TouchPoint) { 
        if(!(id in this.touches)){
            return;
        }
        Sleeping.set(this.touches[id].body, false);
        this.touches[id].lastPosition = point;
        this.touches[id].constraint.pointA = Vector.create(point.x, point.y);
    }
    refresh() {
        for(const id in this.touches){
            const touch = this.touches[id];
            touch.constraint.pointA = Vector.create(touch.lastPosition.x, touch.lastPosition.y);
            Sleeping.set(touch.body, false);
        }
    }
    remove(id: string) { 
        if(!(id in this.touches)){
            return;
        }
        Composite.remove(this.engine.world, this.touches[id].constraint);
        delete this.touches[id];
    }
}