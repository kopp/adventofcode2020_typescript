import { read_file_of_strings } from "./read_file_utils";


export class Point3D
{
    x: number = 0;
    y: number = 0;
    z: number = 0;
}

export class Point4D
{
    x: number = 0;
    y: number = 0;
    z: number = 0;
    w: number = 0;
}

type Point = Point3D | Point4D;

// Do not put methods into the Point* classes.
// Now it is still possible to initialize them with a {x: 0, y: 1, z: 2} etc.,
// if there was a method, this would not be possible.

function stringify(point: Point): string
{
    if ("w" in point) {
        return point.x.toString() + ":" + point.y.toString() + ":" + point.z.toString() + ":" + point.w.toString();
    }
    else {
        return point.x.toString() + ":" + point.y.toString() + ":" + point.z.toString();
    }
}


export enum OccupiedNeighbours
{
    two = 2,
    three = 3,
    max = three,
    other = 1000,
}

function enumify(number_of_neighbours: number): OccupiedNeighbours
{
    switch (number_of_neighbours)
    {
        case 2:
            return OccupiedNeighbours.two;
        case 3:
            return OccupiedNeighbours.three;
        default:
            return OccupiedNeighbours.other;
    }
}


export class Grid<PointType extends Point>
{
    cells = new Map<string, boolean>();
    /**
     * smallest values in the grid
     */
    bottom_left: PointType;
    /**
     * largest values in the grid.
     */
    top_right: PointType;

    pointTypeConstructor: { new (): PointType };
    is4d: boolean;

    constructor(pointTypeConstructor: new () => PointType)
    {
        this.pointTypeConstructor = pointTypeConstructor;
        this.bottom_left = new pointTypeConstructor();
        this.top_right = new pointTypeConstructor();
        this.is4d = ("w" in this.bottom_left);
    }

    is_occupied(position: PointType): boolean
    {
        const value = this.cells.get(stringify(position));
        if ((value == null) || (value == false)) {
            return false;
        }
        else {
            return true;
        }
    }

    set_occupation(position: PointType, is_occupied: boolean): void
    {
        this.cells.set(stringify(position), is_occupied);

        this.bottom_left.x = Math.min(position.x, this.bottom_left.x);
        this.top_right.x = Math.max(position.x, this.top_right.x);

        this.bottom_left.y = Math.min(position.y, this.bottom_left.y);
        this.top_right.y = Math.max(position.y, this.top_right.y);

        this.bottom_left.z = Math.min(position.z, this.bottom_left.z);
        this.top_right.z = Math.max(position.z, this.top_right.z);

        if ("w" in position) {
            (this.bottom_left as Point4D).w = Math.min((position as Point4D).w, (this.bottom_left as Point4D).w);
            (this.top_right as Point4D).w = Math.max((position as Point4D).w, (this.top_right as Point4D).w);
        }
    }

    /**
     * Allow to iterate over all pionts in a box so that at least all ocupied
     * cells are within the box and a "one grid cell" margin of unoccupied
     * points as well.
     * Note: The box may be larger.
     */
    box_around_points(): Array<PointType>  // could be generator: *box_around_points(): Generator<PointType> { ... yield {x: ...} }
    {
        let ws = new Array<number>();
        if (this.is4d) {
            for (let w = (this.bottom_left as Point4D).w - 1; w <= (this.top_right as Point4D).w + 1; ++w) {
                ws.push(w);
            }
        }
        else {
            ws.push(0); // dummy value to get precisely one iteration below
        }

        let points = new Array<PointType>();
        for (let w of ws) {
            for (let z = this.bottom_left.z - 1; z <= this.top_right.z + 1; ++z) {
                for (let y = this.bottom_left.y - 1; y <= this.top_right.y + 1; ++y) {
                    for (let x = this.bottom_left.x - 1; x <= this.top_right.x + 1; ++x) {
                        let point = new this.pointTypeConstructor();
                        point.x = x;
                        point.y = y;
                        point.z = z;
                        if (this.is4d) {
                            (point as Point4D).w = w;
                        }
                        points.push(point);
                    }
                }
            }
        }
        return points;
    }

    get_number_of_occupied_neighbours(position: PointType): OccupiedNeighbours
    {
        const possible_deltas = [-1, 0, +1];

        let w_deltas: Array<number>;

        if (this.is4d) {
            w_deltas = possible_deltas;
        }
        else {
            w_deltas = [0]; // dummy value to get one iteration
            // Note: do not use a value different from 0 as it will be used in
            // the check for the this position below.
        }

        let number_of_occupied_neighbours = 0;

        for (const dw of w_deltas) {
            for (const dx of possible_deltas) {
                for (const dy of possible_deltas) {
                    for (const dz of possible_deltas) {
                        let is_this_position = (dx === 0) && (dy === 0) && (dz === 0) && (dw === 0);
                        if (is_this_position) {
                            continue;
                        }
                        const neighbour_position = new this.pointTypeConstructor();
                        neighbour_position.x = position.x + dx;
                        neighbour_position.y = position.y + dy;
                        neighbour_position.z = position.z + dz;
                        if (this.is4d) {
                            (neighbour_position as Point4D).w = (position as Point4D).w + dw;
                        }
                        if (this.is_occupied(neighbour_position)) {
                            number_of_occupied_neighbours += 1;
                        }
                        // fastrack: we're only interested in some values
                        if (number_of_occupied_neighbours > OccupiedNeighbours.max) {
                            return enumify(number_of_occupied_neighbours);
                        }
                    }
                }
            }
        }

        return enumify(number_of_occupied_neighbours);
    }

    get_number_of_occupied(): number
    {
        let count = 0;
        for (const cell_value of this.cells.values()) {
            if (cell_value === true) {
                count += 1;
            }
        }
        return count;
    }

}


export function execute_conway_step<PointType extends Point>(grid: Grid<PointType>): Grid<PointType>
{
    const updated_grid = new Grid(grid.pointTypeConstructor);
    for (const point of grid.box_around_points()) {
        const is_active = grid.is_occupied(point);
        const active_neighbours = grid.get_number_of_occupied_neighbours(point);

        let activate = false;
        if (is_active === true) {
            if ((active_neighbours === OccupiedNeighbours.two) || (active_neighbours === OccupiedNeighbours.three)) {
                activate = true;
            }
        }
        else {
            if (active_neighbours === OccupiedNeighbours.three) {
                activate = true;
            }
        }

        if (activate) {
            updated_grid.set_occupation(point, true);
        }
    }
    return updated_grid;
}



export function parse_grid_from_strings<PointType extends Point>(input: Array<string>, pointTypeConstructor: { new (): PointType }): Grid<PointType>
{
    let grid = new Grid(pointTypeConstructor);
    let point: PointType = new grid.pointTypeConstructor();

    for (const line of input)
    {
        for (const char of line) {
            if (char === "#") {
                grid.set_occupation(point, true);
            }
            else if (char === ".") {
                // ignore
            }
            else {
                throw new Error(`Unable to parse character ${char} in line ${line}.`);
            }
            point.x += 1;
        }
        point.y += 1;
        point.x = 0;
    }
    return grid;
}


function count_active_cells_after_n_cycles<PointType extends Point>(grid: Grid<PointType>, n: number): number
{
    let current_grid = grid;
    for (let repetition = 0; repetition < n; ++repetition)
    {
        current_grid = execute_conway_step(current_grid);
    }
    return current_grid.get_number_of_occupied();
}



if (require.main === module) {
    const input = read_file_of_strings("input/day17");

    const initial_grid_3d = parse_grid_from_strings(input, Point3D);
    console.log("Problem 1: ", count_active_cells_after_n_cycles(initial_grid_3d, 6));

    const initial_grid_4d = parse_grid_from_strings(input, Point4D);
    console.log("Problem 2: ", count_active_cells_after_n_cycles(initial_grid_4d, 6));
}