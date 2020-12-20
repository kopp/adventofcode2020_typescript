import { hash_border } from "../src/day20";


test("hash", () => {
    expect(hash_border("")).toEqual(hash_border(""));
    expect(hash_border(".#.")).toEqual(hash_border(".#."));
    expect(hash_border("#..")).toEqual(hash_border("..#"));
})