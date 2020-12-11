import {
    isPermutationOf
} from "../src/list_utils";

test("isPermutationOf", () => {
    expect(isPermutationOf([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isPermutationOf([1, 3, 2], [1, 2, 3])).toBe(true);
    expect(isPermutationOf([1, 3   ], [1, 2, 3])).toBe(false);
    expect(isPermutationOf([1, 3   ], [   2, 3])).toBe(false);
    expect(isPermutationOf([], [])).toBe(true);
    expect(isPermutationOf([1], [1])).toBe(true);
    expect(isPermutationOf(["foo", "bar"], ["bar", "foo"])).toBe(true);
});