import { read_file_of_strings } from "./read_file_utils";
import { Vector2d, linearcombination, manhattan_distance } from "./vector_utils";


export enum Direction
{
    East = 0,
    South = 1,
    West = 2,
    North = 3,
};

export class OnGridMover
{
    position: Vector2d = {x: 0, y: 0};
    direction = Direction.East;

    static HeadingFor: Map<Direction, Vector2d> = new Map([
        [Direction.East, {x: 1,  y: 0}],
        [Direction.West, {x: -1, y: 0}],
        [Direction.North, {x: 0, y: 1}],
        [Direction.South, {x: 0, y: -1}],
    ]);

    forwards(steps: number): void
    {
        const direction = OnGridMover.HeadingFor.get(this.direction);
        if (direction == null) {
            throw new Error(`Unable to interpret direction ${this.direction}.`);
        }
        this.position = linearcombination(this.position, steps, direction);
    }

    /**
     * change direction to the left
     */
    turn_left(): void
    {
        this.direction = (this.direction + 3) % 4;
    }

    /**
     * rotate around the origin; this changes the position and includes turning
     */
    rotate_left(): void
    {
        const new_position = {x: -this.position.y, y: this.position.x};
        this.position = new_position;
        this.turn_left();
    }

    turn_right(): void
    {
        this.direction = (this.direction + 1) % 4;
    }

    rotate_right(): void
    {
        const new_position = {x: this.position.y, y: -this.position.x};
        this.position = new_position;
        this.turn_right();
    }

    turn_around(): void
    {
        this.direction = (this.direction + 2) % 4;
    }

    rotate_around(): void
    {
        const new_position = {x: -this.position.x, y: -this.position.y};
        this.position = new_position;
        this.turn_around();
    }

    go_north(steps: number): void
    {
        this.position.y += steps;
    }

    go_south(steps: number): void
    {
        this.position.y -= steps;
    }

    go_east(steps: number): void
    {
        this.position.x += steps;
    }

    go_west(steps: number): void
    {
        this.position.x -= steps;
    }

};


export function move_mover_by_script(mover: OnGridMover, commands: Array<string>): void
{
    for (const command of commands) {
        const match = command.match(/^([NSEWF])(\d+)$/);
        if (match != null) {
            const direction = match[1];
            const steps = parseInt(match[2]);
            switch (direction) {
                case "F":
                    mover.forwards(steps);
                    break;
                case "N":
                    mover.go_north(steps);
                    break;
                case "S":
                    mover.go_south(steps);
                    break;
                case "W":
                    mover.go_west(steps);
                    break;
                case "E":
                    mover.go_east(steps);
                    break;
                default:
                    throw new Error(`Unable to process command ${command}.`);
            }
        }
        else {
            switch (command) {
                case "R90":
                case "L270":
                    mover.turn_right();
                    break;
                case "R270":
                case "L90":
                    mover.turn_left();
                    break;
                case "R180":
                case "L180":
                    mover.turn_around();
                    break;
                default:
                    throw new Error(`Unable to process command ${command}.`);
            }
        }
    }
}


if (require.main === module) {
    let input = read_file_of_strings("input/day12");

    {
        let mover = new OnGridMover();
        move_mover_by_script(mover, input);
        console.log("Problem 1: ", manhattan_distance({x: 0, y: 0}, mover.position));
    }
}