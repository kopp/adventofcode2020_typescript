import {
    characters_in_any_of
} from "../src/day06";

test("characters_in_any_of", () => {
    expect(characters_in_any_of(["a", "b"])).toEqual(new Set(["a", "b"]));  // toBe will fail here
    expect(characters_in_any_of(["ab", "b"])).toEqual(new Set(["a", "b"]));
    expect(characters_in_any_of(["ab", "a"])).toEqual(new Set(["a", "b"]));
    expect(characters_in_any_of(["a", "bc"])).toEqual(new Set(["a", "b", "c"]));
    expect(characters_in_any_of(["abc", "abc"])).toEqual(new Set(["a", "b", "c"]));
});