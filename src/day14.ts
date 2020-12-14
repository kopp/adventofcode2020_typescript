import { read_file_of_strings } from "./read_file_utils";


class BitMask
{
    mask: string;

    constructor(mask: string)
    {
        this.mask = mask;
    }

    apply_to(value: number) {
        const binary_value = value.toString(2).padStart(this.mask.length, "0");
        let masked_binary_value = binary_value;
        for (let i = 0; i < this.mask.length; ++i) {
            if (this.mask[i] != "X") {
                masked_binary_value = this.mask[i];
            }
        }
        const masked_value = parseInt(masked_binary_value, 2);
        return masked_value;
    }

}


export function simulate_masked_memory_storage(commands: Array<string>): number
{
    let ones_to_enforce = 0;
    let zeros_to_enforce = 0;
    let memory: Map<number, number> = new Map();
    for (const line of commands) {
        if (line.startsWith("mask")) {
            const match = line.match(/^mask = ([01X]+)$/);
            if (match == null) {
                throw new Error(`Unable to parse mask in line ${line}.`);
            }
            const mask = match[1];

            const ones_to_enforce_string = mask.replace(/X/g, char => "0");
            const zeros_to_enforce_string = mask.replace(/[X]/g, char => "1");
            ones_to_enforce = parseInt(ones_to_enforce_string, 2);
            zeros_to_enforce = parseInt(zeros_to_enforce_string, 2);
        }
        else if (line.startsWith("mem[")) {
            const match = line.match(/^mem\[(\d+)\] = (\d+)$/);
            if (match == null) {
                throw new Error(`Unable to parse operation in line ${line}.`);
            }
            const address = parseInt(match[1]);
            const value_without_mask_applied = parseInt(match[2]);

            const value_with_ones_enforced = value_without_mask_applied | ones_to_enforce;
            const value_with_zeros_enforced = value_without_mask_applied & zeros_to_enforce;
            let value_with_masks_applied = (value_without_mask_applied | ones_to_enforce) & zeros_to_enforce;

            if (value_with_masks_applied < 0) {
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