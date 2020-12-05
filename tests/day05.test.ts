import {
    find_gap_in_numbers
} from "../src/day05";

test("find gaps", () => {
    expect(find_gap_in_numbers([1, 2, 3, 5, 6])).toBe(4);
    // .sort by default sorts lexiographically, i.e. 11 before 2
    expect(find_gap_in_numbers([7, 8, 9, 11, 12])).toBe(10);
});