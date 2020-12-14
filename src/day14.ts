import { read_file_of_strings } from "./read_file_utils";


// Since strings are immutable, create a new string
function replace_character_in_string(original_string: string, index: number, character: string) {
    if(index > original_string.length-1) {
        return original_string
    }
    else {
        const start = original_string.substring(0, index);
        const end = original_string.substring(index + 1);
        return start + character + end;
    }
}

class BitMask
{
    mask: string | null;

    constructor(mask: string | null = null)
    {
        this.mask = mask;
    }

    apply_to(value: number) {
        if (this.mask == null) {
            throw new Error("Please initialize with a valid mask before using this.");
        }
        const binary_value = value.toString(2).padStart(this.mask.length, "0");
        let masked_binary_value = binary_value;
        for (let i = 0; i < this.mask.length; ++i) {
            if (this.mask[i] != "X") {
                masked_binary_value = replace_character_in_string(masked_binary_value, i, this.mask[i]);
            }
        }
        const masked_value = parseInt(masked_binary_value, 2);
        return masked_value;
    }

}


export function simulate_masked_memory_storage(commands: Array<string>): number
{
    let memory: Map<number, number> = new Map();
    let bitmask = new BitMask();
    for (const line of commands) {
        if (line.startsWith("mask")) {
            const match = line.match(/^mask = ([01X]+)$/);
            if (match == null) {
                throw new Error(`Unable to parse mask in line ${line}.`);
            }
            const mask = match[1];
            bitmask = new BitMask(mask);
        }
        else if (line.startsWith("mem[")) {
            const match = line.match(/^mem\[(\d+)\] = (\d+)$/);
            if (match == null) {
                throw new Error(`Unable to parse operation in line ${line}.`);
            }
            const address = parseInt(match[1]);
            const value_without_mask_applied = parseInt(match[2]);

            let value_with_masks_applied = bitmask.apply_to(value_without_mask_applied);

            if (value_with_masks_applied < 0) {
                throw new Error("< 0");
                value_with_masks_applied = ~ value_with_masks_applied + 1;
            }

            memory.set(address, value_with_masks_applied);
        }
        else {
            throw new Error(`Unable to parse line ${line}; unknown operation.`);
        }
    }

    let sum = 0;
    for (const value of memory.values()) {
        sum += value;
    }

    return sum;
}



if (require.main === module) {
    const input = read_file_of_strings("input/day14");

    console.log("Problem 1: ", simulate_masked_memory_storage(input));

}