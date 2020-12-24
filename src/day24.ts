import { runInThisContext } from "vm";
import { read_file_of_strings } from "./read_file_utils";


class HexPosition
{
    // cube coordinates; invariant: x + y + z == 0
    x: number = 0;
    y: number = 0;
    z: number = 0;

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
}


class FlippedTiles
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
}