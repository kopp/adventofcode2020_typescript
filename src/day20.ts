import { find_value_not_sum_of_two_numbers_from_preceeding_block } from "./day09";
import { read_empty_lines_separated_blocks } from "./read_file_utils";
import { reverse_string } from "./string_utils";


/**
 * Create hash from the border which is the same for the border and a flipped
 * border.
 */
export function hash_border(border: string): number
{
    const reverse_border = reverse_string(border);
    const lexiographically_lower_representation = border < reverse_border ? border : reverse_border;
    const repr_as_binary_string = lexiographically_lower_representation.replace(/\./g, "0").replace(/#/g, "1");
    const repr_as_number = parseInt(repr_as_binary_string, 2);
    return repr_as_number;
}


enum Direction
{
    right = 0,
    down = 1,
    left = 2,
    up = 3,
}


export class Tile
{
    id: number;

    /**
     * The borders as "graphics" with "#" and ".".
     * Order in array: right, down, left, up (like in enum Direction).
     * The borders read from left to right or from top to bottom.
     */
    borders: Array<string>;
    hashes_of_borders: Array<number>;
    private set_of_hashes_of_borders: Set<number>;

    content: Array<string>; // excluding borders

    constructor(description: Array<string>)
    {
        const match_id = description[0].match(/^Tile (\d+):$/);
        if (match_id == null) {
            throw new Error(`Unable to get ID from tile ${description}.`);
        }
        this.id = parseInt(match_id[1]);

        const border_up = description[1];
        const border_down = description[description.length - 1];
        const [border_left, border_right] = (function() {
            let left = "";
            let right = "";
            const right_index = description[1].length - 1;
            for (let row = 1; row < description.length; ++row) {
                left += description[row][0];
                right += description[row][right_index];
            }
            return [left, right];
        })();
        this.borders = [
            border_right,
            border_down,
            border_left,
            border_up,
        ];
        this.hashes_of_borders = [];  // initialize to dummy otherwise ...
        this.set_of_hashes_of_borders = new Set(); // ... compiler complains
        this.update_border_hashes();  // correctly initialize

        this.content = new Array<string>();
        const right_end = description[1].length - 1;
        for (let row = 2; row < description.length - 1; ++row) {
            this.content.push(description[row].slice(1, right_end));
        }
    }

    private update_border_hashes()
    {
        let [right, down, left, up] = this.borders;
        this.hashes_of_borders = [
            hash_border(right),
            hash_border(down),
            hash_border(left),
            hash_border(up),
        ];
        this.set_of_hashes_of_borders = new Set(this.hashes_of_borders);
    }

    has_border(hash: number): boolean
    {
        const has_it = this.set_of_hashes_of_borders.has(hash);
        return has_it;
    }

    /** flip tile horizontally */
    flip() {
        let [right, down, left, up] = this.borders;
        this.borders = [left, reverse_string(down), right, reverse_string(up)];
        this.update_border_hashes();

        const flipped_content = new Array<string>();
        for (let row of this.content) {
            flipped_content.push(reverse_string(row));
        }
        this.content = flipped_content;
    }

    /** rotate left by 90 degrees
     * It would be more elegant to "rotate" the data by accessing it through
     * indices and modify the meaning of the indices...
    */
    rotate_left() {
        let [right, down, left, up] = this.borders;
        this.borders = [reverse_string(down), left, reverse_string(up), right];
        this.update_border_hashes();

        const rotated_content = new Array<string>();
        const edge_length = this.content.length;
        if (edge_length !== this.content[0].length) {
            throw new Error("Found non-square tile.");
        }
        for (let new_row_index = 0; new_row_index < edge_length; ++new_row_index) {
            let new_row = "";
            for (let new_column_index = 0; new_column_index < edge_length; ++ new_column_index) {
                const old_column_index = edge_length - 1 - new_row_index;
                const old_row_index = new_column_index;
                new_row += this.content[old_row_index][old_column_index];
            }
            rotated_content.push(new_row);
        }
        this.content = rotated_content;
    }
}


function align_tile_such_that_border_is(tile: Tile, which_border: Direction, border_content: string): void
{
    // find alignment via brute force
    let rotations_tried = 0;
    while (tile.borders[which_border] !== border_content) {
        if (rotations_tried >= 8) {
            throw new Error("Unable to align tiles.");
        }
        tile.rotate_left();
        rotations_tried += 1;
        if (rotations_tried == 4) {
            tile.flip();
        }
    }

}


export class SquareGridOfTiles
{
    readonly tiles_per_dimension: number;

    /** Number of "pixels" in a single tile in x and y direction */
    readonly tile_length: number;

    /** number of "pixels" in x and y direction */
    readonly edge_length: number;

    /** (square) matrix of tiles */
    readonly tiles: Array<Array<Tile>>;

    constructor(top_left: Tile, all_tiles: Array<Tile>)
    {
        this.tiles_per_dimension = Math.sqrt(all_tiles.length);
        this.tile_length = all_tiles[0].content.length;
        if (this.tile_length !== all_tiles[0].content[0].length) {
            throw new Error("Not-square tile detected!");
        }
        this.edge_length = this.tiles_per_dimension * this.tile_length;

        const number_of_tiles_expected = this.tiles_per_dimension * this.tiles_per_dimension;
        if (number_of_tiles_expected !== all_tiles.length) {
            throw new Error(`Expected ${number_of_tiles_expected} in a square grid but got ${all_tiles.length}.`);
        }

        function get_other_tile_with_border(border: string, this_tile: Tile): Tile
        {
            for (const tile of all_tiles) {
                if (tile.has_border(hash_border(border))) {
                    if (tile.id === this_tile.id) {
                        continue;
                    }
                    else {
                        return tile;
                    }
                }
            }
            throw new Error(`Unable to find a tile with border ${border}.`);
        }

        this.tiles = new Array<Array<Tile>>();

        for (let row = 0; row < this.tiles_per_dimension; ++row) {
            const current_row = new Array<Tile>();
            for (let column = 0; column < this.tiles_per_dimension; ++column) {
                // for the leftmost tile, check the line above
                if (column == 0) {
                    if (row == 0) {
                        current_row.push(top_left);
                    }
                    else {
                        const tile_above = this.tiles[row - 1][0];
                        let next_border_down = tile_above.borders[Direction.down];
                        const next_tile_down = get_other_tile_with_border(next_border_down, tile_above); // todo: get each tile only once?

                        align_tile_such_that_border_is(next_tile_down, Direction.up, next_border_down);

                        // add
                        current_row.push(next_tile_down);
                    }
                }
                // for all other tiles, check the tile left
                else {
                    const tile_left = current_row[column - 1];
                    let next_border_right = tile_left.borders[Direction.right];
                    const next_tile_right = get_other_tile_with_border(next_border_right, tile_left); // todo: get each tile only once?

                    align_tile_such_that_border_is(next_tile_right, Direction.left, next_border_right);

                    // add
                    current_row.push(next_tile_right);
                }
            }
            this.tiles.push(current_row);
        }
    }

    data_at(row: number, column: number): boolean
    {
        if ((row < 0) || (row >= this.edge_length)) {
            throw new Error(`Invalid Row index ${row}.`);
        }
        if ((column < 0) || (column >= this.edge_length)) {
            throw new Error(`Invalid Column index ${column}.`);
        }

        const row_in_grid = Math.floor(row / this.tile_length);
        const row_in_tile = row % this.tile_length;
        const column_in_grid = Math.floor(column / this.tile_length);
        const column_in_tile = column % this.tile_length;

        const value = this.tiles[row_in_grid][column_in_grid].content[row_in_tile][column_in_tile];
        switch (value) {
            case "#":
                return true;
            case ".":
                return false;
            default:
                throw new Error(`Unknown symbol at ${row}, ${column}: ${value}.`);
        }
    }
}


export class MonsterFinder {

    static monster_indices_template: Array<[number, number]> = [
        [0, 18],
        [1, 0],
        [1, 5],
        [1, 6],
        [1, 11],
        [1, 12],
        [1, 17],
        [1, 18],
        [1, 19],
        [2, 1],
        [2, 4],
        [2, 7],
        [2, 10],
        [2, 13],
        [2, 16],
    ];

    /**
     * [row,column] tuples indicating positions where the monster is set -- all
     * values are >= 0, monster "upper left" edge is at (0, 0).
     */
    monster_indices = [...MonsterFinder.monster_indices_template];

    rotate_left(): void
    {
        const rotated_positions = new Array<[number, number]>();

        const monster_max_col = this.max_coordinates()[1];
        for (const [row, col] of this.monster_indices) {
            rotated_positions.push([monster_max_col - col, row]);
        }

        this.monster_indices = rotated_positions;
    }

    /** flip horizontally */
    flip(): void
    {
        const flipped_positions = new Array<[number, number]>();

        const monster_max_col = this.max_coordinates()[1];
        for (const [row, col] of this.monster_indices) {
            flipped_positions.push([row, monster_max_col - col]);
        }

        this.monster_indices = flipped_positions;
    }

    private max_coordinates(): [number, number]
    {
        const [monster_max_row, monster_max_col] = this.monster_indices.reduce(
            (previous, coordinate) => [Math.max(previous[0], coordinate[0]), Math.max(previous[1], coordinate[1])],
            [0, 0]
        );
        return [monster_max_row, monster_max_col];
    }

    find_monsters(grid: SquareGridOfTiles) : Set<[number, number]>
    {
        const monster_at_coordinates = new Set<[number, number]>();

        const [monster_max_row, monster_max_col] = this.max_coordinates();

        for (let search_window_col = 0; search_window_col < grid.edge_length - monster_max_col; ++search_window_col) {
            for (let search_window_row = 0; search_window_row < grid.edge_length - monster_max_row; ++search_window_row) {
                // find the indices for this monster
                const this_monster_coordinates = new Array<[number, number]>();
                for (const relative_monster_position of this.monster_indices) {
                    const row = search_window_row + relative_monster_position[0];
                    const col = search_window_col + relative_monster_position[1];
                    this_monster_coordinates.push([row, col]);
                }
                // check whether there is a monster
                let is_monster = true;
                for (const [row, col] of this_monster_coordinates)
                {
                    if (grid.data_at(row, col)) {
                        continue;
                    }
                    else {
                        is_monster = false;
                        break;
                    }
                }
                // and if so, mark the pixels
                if (is_monster) {
                    for (const coordinate of this_monster_coordinates) {
                        monster_at_coordinates.add(coordinate);
                    }
                }
            }
        }

        return monster_at_coordinates;
    }
}


export function find_monsters_in_all_possible_orientations(grid: SquareGridOfTiles): Set<[number, number]>
{
    const finder = new MonsterFinder();

    const findings_for_all_possible_orientations = new Array<ReturnType<typeof finder.find_monsters>>();

    for (let i = 0; i < 8; ++i) {
        if (i === 4) {
            finder.flip();
        }
        findings_for_all_possible_orientations.push(finder.find_monsters(grid));
        finder.rotate_left();
    }

    let relevant_findings: Set<[number, number]> | undefined = undefined;
    let found_the_one_good_orientation = false;
    for (const finding of findings_for_all_possible_orientations) {
        if (finding.size !== 0) {
            if (found_the_one_good_orientation) {
                throw new Error("Already got findings for a different orientation.");
            }
            else {
                found_the_one_good_orientation = true;
                relevant_findings = finding;
            }
        }
    }

    if (relevant_findings == undefined) {
        throw new Error("Unable to find Sea Monsters for any orientation.");
    }

    return relevant_findings;
}



function parse_tiles(input: Array<Array<string>>): Array<Tile>
{
    const tiles = Array<Tile>();
    for (const tile_description of input) {
        tiles.push(new Tile(tile_description));
    }
    return tiles;
}


/**
 * For each number of matching tiles, return all tiles that have so many
 * borders in common with other tiles.
 */
function histogram_of_tile_border_matches(tiles: Array<Tile>): Map<number, Array<Tile>>
{
    const histogram = new Map<number, Array<Tile>>();
    for (let index_under_investigation = 0; index_under_investigation < tiles.length; ++index_under_investigation) {
        const tile_under_investigation = tiles[index_under_investigation];

        let count_same_borders = 0;
        for (const border of tile_under_investigation.hashes_of_borders) {
            for (let index_other = 0; index_other < tiles.length; ++index_other) {
                if (index_other === index_under_investigation) {
                    continue;
                }
                if (tiles[index_other].has_border(border)) {
                    count_same_borders += 1;
                }
            }
        }

        if (! histogram.has(count_same_borders)) {
            histogram.set(count_same_borders, new Array<Tile>());
        }
        histogram.get(count_same_borders)?.push(tile_under_investigation);
    }
    return histogram;
}


if (require.main === module) {
    const input = read_empty_lines_separated_blocks("input/day20");
    const tiles = parse_tiles(input);
    const histogram = histogram_of_tile_border_matches(tiles);

    for (const repetitions of histogram.keys()) {
        console.log("Repetitions ", repetitions, " -> ", histogram.get(repetitions)?.length);
    }

    const possible_corners = histogram.get(2);
    if (possible_corners?.length == 4) {
        let product_of_ids = 1;
        for (const tile of possible_corners) {
            product_of_ids *= tile.id;
        }
        console.log("Problem 1: ", product_of_ids);
    }
    else {
        throw new Error(`Got more than just 4 tiles with only two matches: ${possible_corners?.length}.`);
    }


    const top_left = possible_corners[0];
    const grid = new SquareGridOfTiles(top_left, tiles);
    const monster_coordinates = find_monsters_in_all_possible_orientations(grid);
    const number_of_occupied_pixels = (function () {
        let num_occupied = 0;
        for (let row = 0; row < grid.edge_length; ++row) {
            for (let col = 0; col < grid.edge_length; ++col) {
                if (grid.data_at(row, col)) {
                    num_occupied += 1;
                }
            }
        }
        return num_occupied;
    })();
    const occupied_and_not_part_of_monster = number_of_occupied_pixels - monster_coordinates.size;
    console.log("Problem 2: ", occupied_and_not_part_of_monster);
}