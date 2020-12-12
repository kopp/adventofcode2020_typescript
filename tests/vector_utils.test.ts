import { linearcombination, manhattan_distance, manhattan_length } from "../src/vector_utils";


test("linearcombination", () => {
    const a = {x: 1, y: 2};
    const b = {x: 2, y: -3};
    expect(linearcombination(a, 0, b)).toEqual(a);
    expect(linearcombination(a, 1, b)).toEqual({x: 3, y: -1});
});


test("manhattan_distance", () => {
    const a = {x: 1, y: 2};
    const b = {x: 2, y: -3};
    expect(manhattan_distance(a, a)).toBe(0);
    expect(manhattan_distance(a, b)).toBe(6);

});

test("manhattan_length", () => {
    const a = {x: 1, y: 2};
    const b = {x: 17, y: -8};
    expect(manhattan_length({x: 0, y: 0})).toBe(0);
    expect(manhattan_length(a)).toBe(3);
    expect(manhattan_length(b)).toBe(25);

});
