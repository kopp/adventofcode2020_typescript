import {
    Grid,
    Point3D,
    Point4D,
    OccupiedNeighbours,
    parse_grid_from_strings,
    execute_conway_step,
} from "../src/day17";


test("Grid: status, neighbours", () => {
    let grid = new Grid(Point3D);
    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(false);
    expect(grid.is_occupied({x: 1, y: 1, z: 1})).toBe(false);
    expect(grid.get_number_of_occupied()).toBe(0);

    grid.set_occupation({x: 0, y: 0, z: 0}, true);
    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(true);
    expect(grid.is_occupied({x: 1, y: 1, z: 1})).toBe(false);
    expect(grid.get_number_of_occupied()).toBe(1);

    grid.set_occupation({x: 1, y: 1, z: 1}, true);
    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(true);
    expect(grid.is_occupied({x: 1, y: 1, z: 1})).toBe(true);
    expect(grid.get_number_of_occupied()).toBe(2);

    grid.set_occupation({x: 1, y: 1, z: 1}, false);
    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(true);
    expect(grid.is_occupied({x: 1, y: 1, z: 1})).toBe(false);
    expect(grid.get_number_of_occupied()).toBe(1);
    grid.set_occupation({x: 0, y: 0, z: 0}, false);
    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(false);
    expect(grid.is_occupied({x: 1, y: 1, z: 1})).toBe(false);
    expect(grid.get_number_of_occupied()).toBe(0);

    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.other); // 0
    grid.set_occupation({x: 1, y: 1, z: 1}, true);
    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.other); // 1
    grid.set_occupation({x: 1, y: -1, z: 1}, true);
    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.two);
    grid.set_occupation({x: -1, y: -1, z: 1}, true);
    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.three);
    grid.set_occupation({x: -1, y: -1, z: 2}, true);
    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.three);
    grid.set_occupation({x: -1, y: -1, z: -1}, true);
    expect(grid.get_number_of_occupied_neighbours({x: 0, y: 0, z: 0})).toBe(OccupiedNeighbours.other); // 4

});


test("Grid: box", () => {
    let grid = new Grid(Point3D);
    grid.set_occupation({x: 0, y: 0, z: 0}, true);

    let num_points = 0;
    for (const point of grid.box_around_points()) {
        num_points += 1;
    }
    expect(num_points).toBe(27);
});


test("parse and run", () => {
    const input = [
        ".#.",
        "..#",
        "###",
    ];
    const grid = parse_grid_from_strings(input, Point3D);

    expect(grid.is_occupied({x: 0, y: 0, z: 0})).toBe(false);
    expect(grid.is_occupied({x: 1, y: 0, z: 0})).toBe(true);
    expect(grid.is_occupied({x: 2, y: 0, z: 0})).toBe(false);
    expect(grid.is_occupied({x: 2, y: 1, z: 0})).toBe(true);
    expect(grid.is_occupied({x: 2, y: 1, z: 1})).toBe(false);

    const grid_step1 = execute_conway_step(grid);
    // Note: The example input is shifted!
    // See https://www.reddit.com/r/adventofcode/comments/ker0wi/2020_day_17_part_1_sample_input_wrong/
    expect(grid_step1.is_occupied({x: 0, y: 1, z: -1})).toBe(true);
    expect(grid_step1.get_number_of_occupied()).toBe(11);
});