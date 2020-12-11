import {
    Room,
    Seat
} from "../src/day11";

import { isPermutationOf } from "../src/list_utils";


const input = [
    "L.LL.LL.LL",
    "LLLLLLL.LL",
    "L.L.L..L..",
    "LLLL.LL.LL",
    "L.LL.LL.LL",
    "L.LLLLL.LL",
    "..L.L.....",
    "LLLLLLLLLL",
    "L.LLLLLL.L",
    "L.LLLLL.LL",
];

const input_with_1_iteration = [
    "#.##.##.##",
    "#######.##",
    "#.#.#..#..",
    "####.##.##",
    "#.##.##.##",
    "#.#####.##",
    "..#.#.....",
    "##########",
    "#.######.#",
    "#.#####.##",
];

const input_with_2_iterations = [
    "#.LL.L#.##",
    "#LLLLLL.L#",
    "L.L.L..L..",
    "#LLL.LL.L#",
    "#.LL.LL.LL",
    "#.LLLL#.##",
    "..L.L.....",
    "#LLLLLLLL#",
    "#.LLLLLL.L",
    "#.#LLLL.##",
]

const input_with_3_iterations = [
    "#.##.L#.##",
    "#L###LL.L#",
    "L.#.#..#..",
    "#L##.##.L#",
    "#.##.LL.LL",
    "#.###L#.##",
    "..#.#.....",
    "#L######L#",
    "#.LL###L.L",
    "#.#L###.##",
]

const input_with_4_iterations = [
    "#.#L.L#.##",
    "#LLL#LL.L#",
    "L.L.L..#..",
    "#LLL.##.L#",
    "#.LL.LL.LL",
    "#.LL#L#.##",
    "..L.L.....",
    "#L#LLLL#L#",
    "#.LLLLLL.L",
    "#.#L#L#.##",
]

const input_with_5_iterations = [
    "#.#L.L#.##",
    "#LLL#LL.L#",
    "L.#.L..#..",
    "#L##.##.L#",
    "#.#L.LL.LL",
    "#.#L#L#.##",
    "..L.L.....",
    "#L#L##L#L#",
    "#.LLLLLL.L",
    "#.#L#L#.##",
]

test("Read and dump input", () => {
    let room = new Room(input);
    expect(room.dump()).toEqual(input);
});

function test_correct_neighbours(room: Room, place_index: { row: number, col: number }, expected_neighbour_seats: Array<{ row: number, col: number}>): void
{
    let neighbours = expected_neighbour_seats.map(
        indices => room.place_at(indices.row, indices.col) as Seat
    )
    let place = room.place_at(place_index.row, place_index.col) as Seat
    expect(isPermutationOf(place.neighbours, neighbours)).toBe(true);
}

test("Correct neighbours", () => {
    let room = new Room(input);
    expect(isPermutationOf(
        (room.place_at(0, 0) as Seat).neighbours,
        [room.place_at(1, 0) as Seat, room.place_at(1, 1) as Seat]
    )).toBe(true);

    test_correct_neighbours(room, {row: 0, col: 0}, [{row: 1, col: 0}, {row: 1, col: 1}]);
    test_correct_neighbours(room, {row: 1, col: 3}, [{row: 0, col: 2}, {row: 0, col: 3}, {row: 1, col: 2}, {row: 1, col: 4}, {row: 2, col: 2}, {row: 2, col: 4}]);
});

test("update", () => {
    let room = new Room(input);
    expect(room.dump()).toEqual(input);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_1_iteration);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_2_iterations);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_3_iterations);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_4_iterations);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_5_iterations);
    expect(room.update()).toBe(false);
    expect(room.dump()).toEqual(input_with_5_iterations); // no change!
});