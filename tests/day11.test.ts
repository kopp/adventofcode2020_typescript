import {
    Part2,
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

const input_with_part1_update = [
    input,
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    ],
    [
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
    expect(isPermutationOf(place.relevant_others, neighbours)).toBe(true);
}

test("Part 1: Correct neighbours", () => {
    let room = new Room(input);
    expect(isPermutationOf(
        (room.place_at(0, 0) as Seat).relevant_others,
        [room.place_at(1, 0) as Seat, room.place_at(1, 1) as Seat]
    )).toBe(true);

    test_correct_neighbours(room, {row: 0, col: 0}, [{row: 1, col: 0}, {row: 1, col: 1}]);
    test_correct_neighbours(room, {row: 1, col: 3}, [{row: 0, col: 2}, {row: 0, col: 3}, {row: 1, col: 2}, {row: 1, col: 4}, {row: 2, col: 2}, {row: 2, col: 4}]);
});

test("update", () => {
    let room = new Room(input);
    expect(room.dump()).toEqual(input);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part1_update[1]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part1_update[2]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part1_update[3]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part1_update[4]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part1_update[5]);
    expect(room.update()).toBe(false);
    expect(room.dump()).toEqual(input_with_part1_update[5]); // no change!
});


// Part 2

const input_with_part2_update =
    [
        input,
        [
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
        ], [
            "#.LL.LL.L#",
            "#LLLLLL.LL",
            "L.L.L..L..",
            "LLLL.LL.LL",
            "L.LL.LL.LL",
            "L.LLLLL.LL",
            "..L.L.....",
            "LLLLLLLLL#",
            "#.LLLLLL.L",
            "#.LLLLL.L#",
        ], [
            "#.L#.##.L#",
            "#L#####.LL",
            "L.#.#..#..",
            "##L#.##.##",
            "#.##.#L.##",
            "#.#####.#L",
            "..#.#.....",
            "LLL####LL#",
            "#.L#####.L",
            "#.L####.L#",
        ], [
            "#.L#.L#.L#",
            "#LLLLLL.LL",
            "L.L.L..#..",
            "##LL.LL.L#",
            "L.LL.LL.L#",
            "#.LLLLL.LL",
            "..L.L.....",
            "LLLLLLLLL#",
            "#.LLLLL#.L",
            "#.L#LL#.L#",
        ], [
            "#.L#.L#.L#",
            "#LLLLLL.LL",
            "L.L.L..#..",
            "##L#.#L.L#",
            "L.L#.#L.L#",
            "#.L####.LL",
            "..#.#.....",
            "LLL###LLL#",
            "#.LLLLL#.L",
            "#.L#LL#.L#",
        ], [
            "#.L#.L#.L#",
            "#LLLLLL.LL",
            "L.L.L..#..",
            "##L#.#L.L#",
            "L.L#.LL.L#",
            "#.LLLL#.LL",
            "..#.L.....",
            "LLL###LLL#",
            "#.LLLLL#.L",
            "#.L#LL#.L#",
        ]
    ];


test("Part 2: Correct neighbours", () => {
    let room = new Room(input, new Part2());
    test_correct_neighbours(room, {row: 0, col: 0}, [{row: 1, col: 0}, {row: 1, col: 1}, {row: 0, col: 2}]);
    test_correct_neighbours(room,
                              {row: 5, col: 4},
        [
            {row: 4, col: 3}, {row: 2, col: 4}, {row: 4, col: 5},
            {row: 5, col: 3},                   {row: 5, col: 5},
            {row: 7, col: 2}, {row: 6, col: 4}, {row: 7, col: 6}
        ]);
});

test("update in part 2", () => {
    let room = new Room(input, new Part2());
    expect(room.dump()).toEqual(input);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[1]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[2]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[3]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[4]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[5]);
    expect(room.update()).toBe(true);
    expect(room.dump()).toEqual(input_with_part2_update[6]);
    expect(room.update()).toBe(false);
    expect(room.dump()).toEqual(input_with_part2_update[6]); // no change
});