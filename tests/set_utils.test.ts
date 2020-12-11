import {
    union,
    intersect,
    isEqual
} from "../src/set_utils";

test("union", () => {
    expect(union("a", "b")).toEqual(new Set(["a", "b"]));
    expect(union("ab", "b")).toEqual(new Set(["a", "b"]));
    expect(union("ab", "a")).toEqual(new Set(["a", "b"]));
    expect(union("a", "bc")).toEqual(new Set(["a", "b", "c"]));
    expect(union("abc", "abc")).toEqual(new Set(["a", "b", "c"]));
});

function test_intersect(arg1: string, arg2: string, expected: string) {
    expect(intersect(arg1, new Set(arg2))).toEqual(new Set(expected));
    expect(intersect(new Set(arg1), new Set(arg2))).toEqual(new Set(expected));
}

test("intersect", () => {
    test_intersect("abc", "cb", "bc");
    test_intersect("abc", "def", "");
});


test("isEqual", () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1,2,3]))).toBe(true);
    expect(isEqual(new Set([1, 2]), new Set([1,2,3]))).toBe(false);
    expect(isEqual(new Set([]), new Set([]))).toBe(true);
    expect(isEqual(new Set([2]), new Set([2]))).toBe(true);
    expect(isEqual(new Set([1]), new Set([2]))).toBe(false);
    expect(isEqual(new Set([]), new Set([2]))).toBe(false);
});