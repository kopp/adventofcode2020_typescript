import { simulate_masked_memory_storage, BitMask } from "../src/day14";
import { isPermutationOf } from "../src/list_utils";


const input = [
    "mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X",
    "mem[8] = 11",
    "mem[7] = 101",
    "mem[8] = 0",
]

test("simple prog", () => {
    expect(simulate_masked_memory_storage(input)).toBe(165);
});


test("overwrite value", () => {
    expect(simulate_masked_memory_storage([
        "mask = XXXXXXXXXX",
        "mem[1] = 10",
        "mem[1] = 20",
        "mem[1] = 30",
    ])).toBe(30);
});

test("do the sum", () => {
    expect(simulate_masked_memory_storage([
        "mask = XXXXXXXXXX",
        "mem[1] = 10",
        "mem[2] = 20",
        "mem[3] = 30",
    ])).toBe(60);
});

test("mask bits to 1", () => {
    const ones_mask = 128;
    expect(simulate_masked_memory_storage([
        "mask = " + ones_mask.toString(2).replace(/0/g, char => "X"),
        "mem[1] = 10",
        "mem[2] = 20",
        "mem[3] = 30",
    ])).toBe(3 * ones_mask + 60);
});


test("Generate floatings 1", () => {
    let mask = new BitMask("000000000000000000000000000000X1001X");
    const floatings = mask.possible_floatings_for(42);
    const expected_floatings = [26, 27, 58, 59];
    expect(floatings.length).toBe(expected_floatings.length);
    expect(new Set(floatings)).toEqual(new Set(expected_floatings));
});