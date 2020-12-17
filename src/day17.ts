import { read_file_of_strings } from "./read_file_utils";


interface Point3D
{
    x: number;
    y: number;
    z: number;
}

function stringify(position: Point3D): string
{
    return position.x.toString() + ":" + position.y.toString() + ":" + position.z.toString();
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


export class Grid3D
{
    cells = new Map<string, boolean>();
    /**
     * smallest x, y, z in the grid
     */
    bottom_left: Point3D = {x: 0, y: 0, z: 0};
    /**
     * largest x, y, z in the grid
     */
    top_right: Point3D = {x: 0, y: 0, z: 0};

    is_occupied(position: Point3D): boolean
    {
        const value = this.cells.get(stringify(position));
        if ((value == null) || (value == false)) {
            return false;
        }
        else {
            return true;
        }
    }

    set_occupation(position: Point3D, is_occupied: boolean): void
    {
        this.cells.set(stringify(position), is_occupied);

        this.bottom_left.x = Math.min(position.x, this.bottom_left.x);
        this.bottom_left.y = Math.min(position.y, this.bottom_left.y);
        this.bottom_left.z = Math.min(position.z, this.bottom_left.z);

        this.top_right.x = Math.max(position.x, this.top_right.x);
        this.top_right.y = Math.max(position.y, this.top_right.y);
        this.top_right.z = Math.max(position.z, this.top_right.z);
    }

    /**
     * Allow to iterate over all pionts in a 3d box so that all ocupied cells
     * are within the box and a "one grid cell" margin of unoccupied points as
     * well.
     * Note: The box may be larger.
     */
    box_around_points(): Array<Point3D>
    {
        let points = new Array<Point3D>();
        for (let z = this.bottom_left.z - 1; z <= this.top_right.z + 1; ++z) {
            for (let y = this.bottom_left.y - 1; y <= this.top_right.y + 1; ++y) {
                for (let x = this.bottom_left.x - 1; x <= this.top_right.x + 1; ++x) {
                    points.push({ x: x, y: y, z: z });
                }
            }
        }
        return points;
    }

    get_number_of_occupied_neighbours(position: Point3D): OccupiedNeighbours
    {
        const possible_deltas = [-1, 0, +1];

        let number_of_occupied_neighbours = 0;

        for (const dx of possible_deltas) {
            for (const dy of possible_deltas) {
                for (const dz of possible_deltas) {
                    const is_this_position = (dx === 0) && (dy === 0) && (dz === 0);
                    if (is_this_position) {
                        continue;
                    }
                    const neighbour_position = {x: position.x + dx, y: position.y + dy, z: position.z + dz};
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


export function execute_conway_step(grid: Grid3D): Grid3D
{
    const updated_grid = new Grid3D();
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


export function parse_grid_from_strings(input: Array<string>): Grid3D
{
    let point: Point3D = {x: 0, y: 0, z: 0};
    let grid = new Grid3D();

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


function count_active_cells_after_n_cycles(grid: Grid3D, n: number): number
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
    const initial_grid = parse_grid_from_strings(input);

    console.log("Problem 1: ", count_active_cells_after_n_cycles(initial_grid, 6));
}