import { read_empty_lines_separated_blocks } from "./read_file_utils";
import { reverse_string } from "./string_utils";


export function hash_border(border: string): number
{
    const reverse_border = reverse_string(border);
    const lexiographically_lower_representation = border < reverse_border ? border : reverse_border;
    const repr_as_binary_string = lexiographically_lower_representation.replace(/\./g, "0").replace(/#/g, "1");
    const repr_as_number = parseInt(repr_as_binary_string, 2);
    return repr_as_number;
}


class Tile
{
    id: number;
    hashes_of_borders: Array<number>;
    private set_of_hashes_of_borders: Set<number>;

    constructor(description: Array<string>)
    {
        const match_id = description[0].match(/^Tile (\d+):$/);
        if (match_id == null) {
            throw new Error(`Unable to get ID from tile ${description}.`);
        }
        this.id = parseInt(match_id[1]);

        const num_rows = description.length - 1;
        const border1 = description[1];
        const border2 = description[description.length - 1];
        const [border3, border4] = (function() {
            let left = "";
            let right = "";
            const right_index = description[1].length - 1;
            for (let row = 1; row < description.length; ++row) {
                left += description[row][0];
                right += description[row][right_index];
            }
            return [left, right];
        })();
        this.hashes_of_borders = [
            hash_border(border1),
            hash_border(border2),
            hash_border(border3),
            hash_border(border4),
        ];
        this.set_of_hashes_of_borders = new Set(this.hashes_of_borders);
    }

    has_border(hash: number): boolean
    {
        const has_it = this.set_of_hashes_of_borders.has(hash);
        return has_it;
    }
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

}