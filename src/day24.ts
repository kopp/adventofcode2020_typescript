import { runInThisContext } from "vm";
import { read_file_of_strings } from "./read_file_utils";


class HexPosition
{
    // cube coordinates; invariant: x + y + z == 0
    x: number = 0;
    y: number = 0;
    z: number = 0;

    static readonly possible_directions = ["e", "se", "sw", "w", "nw", "ne"];

    clone(): HexPosition
    {
        const clone = new HexPosition();
        clone.x = this.x;
        clone.y = this.y;
        clone.z = this.z;
        return clone;
    }

    switch_to_neighbor_in_direction(direction: string): void
    {
        switch (direction) {
            case "e":
                this.x += 1;
                this.y -= 1;
                break;
            case "w":
                this.x -= 1;
                this.y += 1;
                break;
            case "se":
                this.x += 1;
                this.z -= 1;
                break;
            case "nw":
                this.x -= 1;
                this.z += 1;
                break;
            case "sw":
                this.y += 1;
                this.z -= 1;
                break;
            case "ne":
                this.y -= 1;
                this.z += 1;
                break;
            default:
                throw new Error(`Unable to handle direction ${direction}.`);
        }
    }

    stringify(): string
    {
        return this.x.toString() + ":" + this.y.toString() + ":" + this.z.toString();
    }

    static from_string(stringified_position: string): HexPosition
    {
        const position = new HexPosition();
        const match = stringified_position.match(/^(-?\d+):(-?\d+):(-?\d+)$/);
        if (match == null) {
            throw new Error(`Unable to parse the stringified position ${stringified_position}.`);
        }
        position.x = parseInt(match[1]);
        position.y = parseInt(match[2]);
        position.z = parseInt(match[3]);
        return position;
    }

    /** return all 6 neighbours of this position */
    neighbors(): Array<HexPosition>
    {
        const neighbours = new Array<HexPosition>();
        for (const direction of HexPosition.possible_directions) {
            const neighbour = this.clone();  // instead of clone, you could also go there, stringify and go back
            neighbour.switch_to_neighbor_in_direction(direction);
            neighbours.push(neighbour);
        }
        return neighbours;
    }
}


export class FlippedTiles
{
    flipped = new Set<string>();

    flip_tile_at(walk: Array<string>): void
    {
        const position = new HexPosition();
        for (const direction of walk) {
            position.switch_to_neighbor_in_direction(direction);
        }

        const final_position_hash = position.stringify();
        if (this.flipped.has(final_position_hash)) {
            this.flipped.delete(final_position_hash);
        }
        else {
            this.flipped.add(final_position_hash);
        }
    }

    number_of_flipped_tiles(): number
    {
        return this.flipped.size;
    }

    execute_conway_step(): void
    {
        const unfilpped_tiles_to_consider = new Set<HexPosition>();
        const flipped_after_this_step = new Set<string>();

        // first consider flipped ("black") tile only as we know where they are
        for (const stringified_flipped_tile of this.flipped) {
            const tile_position = HexPosition.from_string(stringified_flipped_tile);
            const neighbours = tile_position.neighbors();

            // how many neighbors are flipped?
            let number_of_flipped_neighbours = 0;
            for (const neighbour of neighbours) {
                if (this.flipped.has(neighbour.stringify())) {
                    number_of_flipped_neighbours += 1;
                }
                else {
                    // Here we know that this unflipped neighbour will be close
                    // to a flipped one, so it is worth checking whether to flip
                    // that later.
                    // We do this here, because we already iterate over all
                    // neighbours of the flipped tiles here.
                    unfilpped_tiles_to_consider.add(neighbour);
                }
            }

            // conway rule: only if one or two neighbors of a flipped tile are
            // flipped, it will remain flipped
            if ((number_of_flipped_neighbours === 1) || (number_of_flipped_neighbours === 2)) {
                flipped_after_this_step.add(stringified_flipped_tile);
            }
        }

        // then consider unflipped ("white") tiles
        for (const unflipped_tile of unfilpped_tiles_to_consider) {
            let number_of_flipped_neighbours = 0;
            for (const neighbour of unflipped_tile.neighbors()) {
                if (this.flipped.has(neighbour.stringify())) {
                    number_of_flipped_neighbours += 1;
                }
            }

            // conway rule: only if exactly two neighbours are flipped, flip
            // this as well
            if (number_of_flipped_neighbours === 2) {
                flipped_after_this_step.add(unflipped_tile.stringify());
            }
        }

        this.flipped = flipped_after_this_step;
    }
}


export function split_string_to_directions(input: string): Array<string>
{
    const directions = new Array<string>();
    for (let index = 0; index < input.length; ++index) {
        const character = input[index];
        let direction;
        if ((character === "e") || (character === "w")) {
            direction = character;
        }
        else {
            ++index;
            direction = character + input[index];
        }
        directions.push(direction);
    }
    return directions;
}



if (require.main === module) {
    const input = read_file_of_strings("input/day24");

    const flipped_tiles = new FlippedTiles();
    for (const line of input) {
        const walk = split_string_to_directions(line);
        flipped_tiles.flip_tile_at(walk);
    }
    console.log("Problem 1: ", flipped_tiles.number_of_flipped_tiles());

    for (let conway_iteration = 0; conway_iteration < 100; ++conway_iteration) {
        flipped_tiles.execute_conway_step();
    }
    console.log("Problem 2: ", flipped_tiles.number_of_flipped_tiles());
}