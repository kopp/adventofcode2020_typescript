import { read_file_of_strings } from "./read_file_utils";




if (require.main === module) {
    const input = read_file_of_strings("input/day14");

    let ones_to_enforce = 0;
    let zeros_to_enforce = 0;
    for (const line of input) {
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
            const value_with_masks_applied = (value_without_mask_applied | ones_to_enforce) & zeros_to_enforce;
        }
        else {
            throw new Error(`Unable to parse line ${line}; unknown operation.`);
        }
    }
}