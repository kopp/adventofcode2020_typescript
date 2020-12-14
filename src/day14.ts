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

export class BitMask
{
    mask: string | null;

    constructor(mask: string | null = null)
    {
        this.mask = mask;
    }

    /**
     * Apply the bit mask to the given value in binary bit-wise:
     * - A 1 in the mask is enforced as 1 in the output
     * - A 0 in the mask is enforced as 0 in the output
     * - An X in the mask means to use the value from the number
     */
    apply_to(value: number): number {
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

    /**
     * Generate all possible "floating" values:
     * - A 1 in the mask is enforced as 1 in the output
     * - A 0 in the mask means to use the value from the number
     * - An X in the mask means to enumerate all possible values (0, 1) for
     *   that bit
     */
    possible_floatings_for(value: number): Array<number> {
        if (this.mask == null) {
            throw new Error("Please initialize with a valid mask before using this.");
        }
        const binary_value = value.toString(2).padStart(this.mask.length, "0");
        let masked_binary_value = binary_value;
        let floating_values_at: Array<number> = []
        for (let i = 0; i < this.mask.length; ++i) {
            if (this.mask[i] == "1") {
                masked_binary_value = replace_character_in_string(masked_binary_value, i, this.mask[i]);
            }
            else if (this.mask[i] == "X") {
                floating_values_at.push(i);
            }
        }

        let value_with_floating_bits: Array<string> = [];

        // Enumerate all possible combinaties for the floating positions by
        // counting in binary from 00000 to 11111 (one digit for each element in
        // floating_values_at).
        for (let floating_combination = 0; floating_combination < 2**floating_values_at.length; ++floating_combination)
        {
            const combination = floating_combination.toString(2).padStart(floating_values_at.length, "0");
            let current_masked_binary_value = masked_binary_value;
            for (let i in floating_values_at) {
                const index_of_character_to_replace = floating_values_at[i];
                current_masked_binary_value = replace_character_in_string(
                    current_masked_binary_value,
                    index_of_character_to_replace,
                    combination[i]
                );
            }
            value_with_floating_bits.push(current_masked_binary_value);
        }

        const values_with_floating_bits = value_with_floating_bits.map(value => parseInt(value, 2));
        return values_with_floating_bits;
    }

}


export function simulate_masked_memory_storage(commands: Array<string>, protocol_version: number = 1): number
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

            if (protocol_version == 1) {
                let value_with_masks_applied = bitmask.apply_to(value_without_mask_applied);

                memory.set(address, value_with_masks_applied);
            }
            else if (protocol_version == 2) {
                for (let floating_address of bitmask.possible_floatings_for(address)) {
                    memory.set(floating_address, value_without_mask_applied);
                }
            }
            else {
                throw new Error(`Protocol version ${protocol_version} not supported.`);
            }
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

    console.log("Problem 1: ", simulate_masked_memory_storage(input, 1));
    console.log("Problem 2: ", simulate_masked_memory_storage(input, 2));

}