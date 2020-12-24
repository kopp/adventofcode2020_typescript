import { split_string_to_directions, FlippedTiles } from "../src/day24";

const input = [
    "sesenwnenenewseeswwswswwnenewsewsw",
    "neeenesenwnwwswnenewnwwsewnenwseswesw",
    "seswneswswsenwwnwse",
    "nwnwneseeswswnenewneswwnewseswneseene",
    "swweswneswnenwsewnwneneseenw",
    "eesenwseswswnenwswnwnwsewwnwsene",
    "sewnenenenesenwsewnenwwwse",
    "wenwwweseeeweswwwnwwe",
    "wsweesenenewnwwnwsenewsenwwsesesenwne",
    "neeswseenwwswnwswswnw",
    "nenwswwsewswnenenewsenwsenwnesesenew",
    "enewnwewneswsewnwswenweswnenwsenwsw",
    "sweneswneswneneenwnewenewwneswswnese",
    "swwesenesewenwneswnwwneseswwne",
    "enesenwswwswneneswsenwnewswseenwsese",
    "wnwnesenesenenwwnenwsewesewsesesew",
    "nenewswnwewswnenesenwnesewesw",
    "eneswnwswnwsenenwnwnwwseeswneewsenese",
    "neswnwewnwnwseenwseesewsenwsweewe",
    "wseweeenwnesenwwwswnew",
];


test("Setup grid", () => {
    const flipped_tiles = new FlippedTiles();
    for (const line of input) {
        const walk = split_string_to_directions(line);
        flipped_tiles.flip_tile_at(walk);
    }
    expect(flipped_tiles.number_of_flipped_tiles()).toBe(10);
});


test("Conway Steps", () => {
    const flipped_tiles = new FlippedTiles();
    for (const line of input) {
        const walk = split_string_to_directions(line);
        flipped_tiles.flip_tile_at(walk);
    }
    expect(flipped_tiles.number_of_flipped_tiles()).toBe(10);

    flipped_tiles.execute_conway_step();
    expect(flipped_tiles.number_of_flipped_tiles()).toBe(15);
});