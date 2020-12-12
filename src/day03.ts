import { read_file_of_strings } from "./read_file_utils";

export class GridHorizontallyPeriodic
{
    data: string[];
    horizontal_periodicity: number;
    height: number;

    constructor(rows: string[]) {
        this.data = rows;
        this.horizontal_periodicity = rows[0].length;
        this.height = rows.length;
    }

    isOccupied(row: number, column: number): boolean
    {
        const cell = this.data[row][column % this.horizontal_periodicity];
        const occupied = cell == "#";
        return occupied;
    }
}


interface Movement {
    right: number;
    down: number;
}

export function count_occupied_cells_in_movement(grid: GridHorizontallyPeriodic, movement: Movement) : number {
    let row = 0;
    let column = 0;
    let occupied_count = 0;
    while (row < grid.height) {
        if (grid.isOccupied(row, column)) {
            occupied_count += 1;
        }
        row += movement.down;
        column += movement.right;
    }
    return occupied_count;
}



if (require.main === module) {
    const problem_input = read_file_of_strings("input/day03");
    let grid = new GridHorizontallyPeriodic(problem_input);
    console.log("Part 1: ", count_occupied_cells_in_movement(grid, {right: 3, down: 1}));

    let product_of_occurances = 1
        * count_occupied_cells_in_movement(grid, { right: 1, down: 1 })
        * count_occupied_cells_in_movement(grid, { right: 3, down: 1 })
        * count_occupied_cells_in_movement(grid, { right: 5, down: 1 })
        * count_occupied_cells_in_movement(grid, { right: 7, down: 1 })
        * count_occupied_cells_in_movement(grid, { right: 1, down: 2 })
        ;

    console.log("Part 2: ", product_of_occurances);
}