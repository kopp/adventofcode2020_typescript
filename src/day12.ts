import { read_file_of_strings } from "./read_file_utils";
import { Vector2d, linearcombination, manhattan_length } from "./vector_utils";


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
        this.go_relatively(steps, direction);
    }

    /**
     * Change the position `steps` times by `relative_displacement`.
     */
    go_relatively(steps: number, relative_displacement: Vector2d) {
        this.position = linearcombination(this.position, steps, relative_displacement);
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

}


/**
 * This class interprets the script input into actions to perform on a mover.
 * This is the default implementation, useful for problem part 1 (i.e. F10
 * means to move the default mover forward by 10 steps).
 * The interpretations that need to be changed for part 2 are factored out into
 * `on_*` methods, that can be overridden.
 */
class CommandInterpreter
{
    mover: OnGridMover;

    constructor(mover: OnGridMover) {
        this.mover = mover;
    }

    on_forwards(steps: number): void {
        this.mover.forwards(steps);
    }

    on_right(): void {
        this.mover.turn_right();
    }

    on_left(): void {
        this.mover.turn_left();
    }

    on_around(): void {
        this.mover.turn_around();
    }

    process(commands: Array<string>): void
    {
        for (const command of commands) {
            const match = command.match(/^([NSEWF])(\d+)$/);
            if (match != null) {
                const direction = match[1];
                const steps = parseInt(match[2]);
                switch (direction) {
                    case "F":
                        this.on_forwards(steps);
                        break;
                    case "N":
                        this.mover.go_north(steps);
                        break;
                    case "S":
                        this.mover.go_south(steps);
                        break;
                    case "W":
                        this.mover.go_west(steps);
                        break;
                    case "E":
                        this.mover.go_east(steps);
                        break;
                    default:
                        throw new Error(`Unable to process command ${command}.`);
                }
            }
            else {
                switch (command) {
                    case "R90":
                    case "L270":
                        this.on_right();
                        break;
                    case "R270":
                    case "L90":
                        this.on_left();
                        break;
                    case "R180":
                    case "L180":
                        this.on_around();
                        break;
                    default:
                        throw new Error(`Unable to process command ${command}.`);
                }
            }
        }

    }
}

/**
 * The basic behaviour of the CommandInterpreter still applies to the waypoint
 * (only turn -> rotate).
 * The Follow command is applied to a follower.
 */
class WaypointCommandInterpreter extends CommandInterpreter {
    follower: OnGridMover;
    constructor(waypoint: OnGridMover, follower: OnGridMover) {
        super(waypoint);
        this.follower = follower;
    }

    on_forwards(steps: number): void {
        this.follower.go_relatively(steps, this.mover.position);
    }

    on_right(): void {
        this.mover.rotate_right();
    }

    on_left(): void {
        this.mover.rotate_left();
    }

    on_around(): void {
        this.mover.rotate_around();
    }

}


export function move_mover_by_script(mover: OnGridMover, commands: Array<string>): void
{
    const interpreter = new CommandInterpreter(mover);
    interpreter.process(commands);
}

export function move_waypoint_and_follower_by_script(waypoint: OnGridMover, follower: OnGridMover, commands: Array<string>): void
{
    const interpreter = new WaypointCommandInterpreter(waypoint, follower);
    interpreter.process(commands);

}


if (require.main === module) {
    let input = read_file_of_strings("input/day12");

    {
        let mover = new OnGridMover();
        move_mover_by_script(mover, input);
        console.log("Problem 1: ", manhattan_length(mover.position));
    }
    {
        let waypoint = new OnGridMover();
        waypoint.position = {x: 10, y: 1};
        let follower = new OnGridMover();
        move_waypoint_and_follower_by_script(waypoint, follower, input);
        console.log("Problem 2: ", manhattan_length(follower.position));
    }
}