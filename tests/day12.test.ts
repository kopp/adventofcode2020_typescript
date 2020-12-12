import { Dir } from "fs";
import {
    OnGridMover,
    move_mover_by_script,
    Direction
} from "../src/day12";

// import { manhattan_distance } from "../src/vector_utils";


test("turns", () => {
    let mover = new OnGridMover();
    mover.direction = Direction.North;
    mover.turn_left();
    expect(mover.direction).toBe(Direction.West);
    mover.turn_left();
    expect(mover.direction).toBe(Direction.South);
    mover.turn_left();
    mover.turn_left();
    mover.turn_left();
    mover.turn_left();
    expect(mover.direction).toBe(Direction.South);
    mover.turn_right();
    mover.turn_right();
    mover.turn_right();
    mover.turn_right();
    expect(mover.direction).toBe(Direction.South);
    mover.turn_around();
    mover.turn_around();
    expect(mover.direction).toBe(Direction.South);
});

test("rotations", () => {
    let mover = new OnGridMover();
    const initial_position = {x: 10, y: 4};
    const rotated_right = {x: 4, y: -10};
    const turned_around = {x: -10, y: -4};
    mover.position = initial_position;
    mover.rotate_right();
    expect(mover.position).toEqual(rotated_right);
    mover.rotate_right();
    expect(mover.position).toEqual(turned_around);
    mover.rotate_left();
    expect(mover.position).toEqual(rotated_right);
    mover.rotate_left();
    expect(mover.position).toEqual(initial_position);
    mover.rotate_around();
    expect(mover.position).toEqual(turned_around);
    mover.rotate_around();
    expect(mover.position).toEqual(initial_position);
});


/*
    turn_left(): void
    {
        switch (this.direction) {
            case Direction.East:
                this.direction = Direction.North;
                break;
            case Direction.South:
                this.direction = Direction.East;
                break;
            case Direction.West:
                this.direction = Direction.South;
                break;
            case Direction.North:
                this.direction = Direction.West;
                break;
            default:
                throw new Error(`Unable to turn left from ${this.direction}.`);
        }
    }

    turn_right(): void
    {
        switch (this.direction) {
            case Direction.East:
                this.direction = Direction.South;
                break;
            case Direction.South:
                this.direction = Direction.West;
                break;
            case Direction.West:
                this.direction = Direction.North;
                break;
            case Direction.North:
                this.direction = Direction.East;
                break;
            default:
                throw new Error(`Unable to turn left from ${this.direction}.`);
        }
    }
    */


const input = [
    "F10",
    "N3",
    "F7",
    "R90",
    "F11",
]

test("move", () => {
    let mover = new OnGridMover();
    move_mover_by_script(mover, input);
    expect(mover.position).toEqual({x: 17, y: -8});
});