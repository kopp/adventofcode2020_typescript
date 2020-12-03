import {
    GridHorizontallyPeriodic,
    count_occupied_cells_in_movement
} from "../src/day03";


let test_input = [
    "..##.......",
    "#...#...#..",
    ".#....#..#.",
    "..#.#...#.#",
    ".#...##..#.",
    "..#.##.....",
    ".#.#.#....#",
    ".#........#",
    "#.##...#...",
    "#...##....#",
    ".#..#...#.#",
];

let test_grid = new GridHorizontallyPeriodic(test_input);

test("Example Part 1 and 2", () => {
    expect(count_occupied_cells_in_movement(test_grid, {right: 1, down: 1})).toBe(2);
    expect(count_occupied_cells_in_movement(test_grid, {right: 3, down: 1})).toBe(7);
    expect(count_occupied_cells_in_movement(test_grid, {right: 5, down: 1})).toBe(3);
    expect(count_occupied_cells_in_movement(test_grid, {right: 7, down: 1})).toBe(4);
    expect(count_occupied_cells_in_movement(test_grid, {right: 1, down: 2})).toBe(2);
});