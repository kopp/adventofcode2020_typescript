import { hash_border, Tile, SquareGridOfTiles, MonsterFinder } from "../src/day20";


test("hash", () => {
    expect(hash_border("")).toEqual(hash_border(""));
    expect(hash_border(".#.")).toEqual(hash_border(".#."));
    expect(hash_border("#..")).toEqual(hash_border("..#"));
})


test("Tile: flip", () => {
    const tile = new Tile([
        "Tile 42:",
        "#...",
        ".#..",
        "#...",
        ".###",
    ]);

    expect(tile.borders).toEqual(["...#", ".###", "#.#.", "#..."]);
    expect(tile.content).toEqual(["#.", ".."]);

    tile.flip();
    expect(tile.borders).toEqual(["#.#.", "###.", "...#", "...#"]);
    expect(tile.content).toEqual([".#", ".."]);
});

test("Tile: rotate", () => {
    const tile = new Tile([
        "Tile 42:",
        "##..",
        ".#..",
        "#...",
        ".###",
    ]);

    tile.rotate_left();
    expect(tile.borders).toEqual(["###.", "#.#.", "..##", "...#"]);
    expect(tile.content).toEqual(["..", "#."]);
});


function make_grid_from_example(): SquareGridOfTiles
{
    const tiles = [
        new Tile([
            "Tile 2311:",
            "..##.#..#.",
            "##..#.....",
            "#...##..#.",
            "####.#...#",
            "##.##.###.",
            "##...#.###",
            ".#.#.#..##",
            "..#....#..",
            "###...#.#.",
            "..###..###",
        ]), new Tile([
            "Tile 1951:",
            "#.##...##.",
            "#.####...#",
            ".....#..##",
            "#...######",
            ".##.#....#",
            ".###.#####",
            "###.##.##.",
            ".###....#.",
            "..#.#..#.#",
            "#...##.#..",

        ]), new Tile([
            "Tile 1171:",
            "####...##.",
            "#..##.#..#",
            "##.#..#.#.",
            ".###.####.",
            "..###.####",
            ".##....##.",
            ".#...####.",
            "#.##.####.",
            "####..#...",
            ".....##...",

        ]), new Tile([
            "Tile 1427:",
            "###.##.#..",
            ".#..#.##..",
            ".#.##.#..#",
            "#.#.#.##.#",
            "....#...##",
            "...##..##.",
            "...#.#####",
            ".#.####.#.",
            "..#..###.#",
            "..##.#..#.",

        ]), new Tile([
            "Tile 1489:",
            "##.#.#....",
            "..##...#..",
            ".##..##...",
            "..#...#...",
            "#####...#.",
            "#..#.#.#.#",
            "...#.#.#..",
            "##.#...##.",
            "..##.##.##",
            "###.##.#..",

        ]), new Tile([
            "Tile 2473:",
            "#....####.",
            "#..#.##...",
            "#.##..#...",
            "######.#.#",
            ".#...#.#.#",
            ".#########",
            ".###.#..#.",
            "########.#",
            "##...##.#.",
            "..###.#.#.",

        ]), new Tile([
            "Tile 2971:",
            "..#.#....#",
            "#...###...",
            "#.#.###...",
            "##.##..#..",
            ".#####..##",
            ".#..####.#",
            "#..#.#..#.",
            "..####.###",
            "..#.#.###.",
            "...#.#.#.#",

        ]), new Tile([
            "Tile 2729:",
            "...#.#.#.#",
            "####.#....",
            "..#.#.....",
            "....#..#.#",
            ".##..##.#.",
            ".#.####...",
            "####.#.#..",
            "##.####...",
            "##..#.##..",
            "#.##...##.",

        ]), new Tile([
            "Tile 3079:",
            "#.#.#####.",
            ".#..######",
            "..#.......",
            "######....",
            "####.#..#.",
            ".#...#.##.",
            "#.#####.##",
            "..#.###...",
            "..#.......",
            "..#.###...",
        ])];

    const expected_data = [
        ".#.#..#.##...#.##..#####",
        "###....#.#....#..#......",
        "##.##.###.#.#..######...",
        "###.#####...#.#####.#..#",
        "##.#....#.##.####...#.##",
        "...########.#....#####.#",
        "....#..#...##..#.#.###..",
        ".####...#..#.....#......",
        "#..#.##..#..###.#.##....",
        "#.####..#.####.#.#.###..",
        "###.#.#...#.######.#..##",
        "#.####....##..########.#",
        "##..##.#...#...#.#.#.#..",
        "...#..#..#.#.##..###.###",
        ".#.#....#.##.#...###.##.",
        "###.#...#..#.##.######..",
        ".#.#.###.##.##.#..#.##..",
        ".####.###.#...###.#..#.#",
        "..#.#..#..#.#.#.####.###",
        "#..####...#.#.#.###.###.",
        "#####..#####...###....##",
        "#.##..#..#...#..####...#",
        ".#.###..##..##..####.##.",
        "...###...##...#...#..###",
    ];

    const top_left = tiles.find((tile) => tile.id === 1951);
    if (top_left == undefined) {
        throw new Error("unable to find top left tile.");
    }

    // should look like it does in the solution
    top_left.flip();
    top_left.rotate_left();
    top_left.rotate_left();

    const grid = new SquareGridOfTiles(top_left, tiles);

    return grid;
}


test("Grid", () => {

    const expected_data = [
        ".#.#..#.##...#.##..#####",
        "###....#.#....#..#......",
        "##.##.###.#.#..######...",
        "###.#####...#.#####.#..#",
        "##.#....#.##.####...#.##",
        "...########.#....#####.#",
        "....#..#...##..#.#.###..",
        ".####...#..#.....#......",
        "#..#.##..#..###.#.##....",
        "#.####..#.####.#.#.###..",
        "###.#.#...#.######.#..##",
        "#.####....##..########.#",
        "##..##.#...#...#.#.#.#..",
        "...#..#..#.#.##..###.###",
        ".#.#....#.##.#...###.##.",
        "###.#...#..#.##.######..",
        ".#.#.###.##.##.#..#.##..",
        ".####.###.#...###.#..#.#",
        "..#.#..#..#.#.#.####.###",
        "#..####...#.#.#.###.###.",
        "#####..#####...###....##",
        "#.##..#..#...#..####...#",
        ".#.###..##..##..####.##.",
        "...###...##...#...#..###",
    ];

    const grid = make_grid_from_example();

    expect(grid.tiles[0][0].id).toBe(1951);
    expect(grid.tiles[0][1].id).toBe(2311);
    expect(grid.tiles[0][2].id).toBe(3079);
    expect(grid.tiles[1][0].id).toBe(2729);
    expect(grid.tiles[1][1].id).toBe(1427);
    expect(grid.tiles[1][2].id).toBe(2473);
    expect(grid.tiles[2][0].id).toBe(2971);
    expect(grid.tiles[2][1].id).toBe(1489);
    expect(grid.tiles[2][2].id).toBe(1171);

    for (let row = 0; row < expected_data.length; ++row) {
        for (let col = 0; col < expected_data[0].length; ++col) {
            expect(grid.data_at(row, col)).toBe(expected_data[row][col] === "#");
        }
    }

});


test("Monster Finder", () => {
    const grid = make_grid_from_example();
    const finder = new MonsterFinder();

    const findings_for_all_possible_orientations = new Array<ReturnType<typeof finder.find_monsters>>();
    for (let i = 0; i < 8; ++i) {
        if (i === 4) {
            finder.flip();
        }
        findings_for_all_possible_orientations.push(finder.find_monsters(grid));
        finder.rotate_left();
    }

    expect(findings_for_all_possible_orientations.length).toBe(8);

    const num_zero_findings = findings_for_all_possible_orientations.reduce((prev, found_coordinates) => found_coordinates.size === 0 ? prev + 1 : prev, 0);
    const total_num_coordinates = findings_for_all_possible_orientations.reduce((prev, found_coordinates) => prev + found_coordinates.size, 0);
    expect(num_zero_findings).toBe(7); // only findings in one orientation
    expect(total_num_coordinates).toBe(30); // two monsters

});