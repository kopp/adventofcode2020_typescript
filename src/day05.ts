import { read_file_of_strings } from "./read_file_utils";


function parse_strange_binary_number(strange_binary: string): number {
    var useful_binary = strange_binary;
    let STRANGE_TO_USEFUL = new Map([
        ["B", "1"],
        ["F", "0"],
        ["R", "1"],
        ["L", "0"],
    ]);
    function replace(to: string, from: string): void {
        useful_binary = useful_binary.replaceAll(from, to);
    }
    STRANGE_TO_USEFUL.forEach(replace);

    return parseInt(useful_binary, 2);
}


export function find_gap_in_numbers(numbers: Array<number>): number | null {
    let numbers_sorted = numbers.sort(function(a, b){return a-b});
    for (let i = 0; i < numbers_sorted.length - 1; ++i) {
        let current = numbers_sorted[i];
        let next = numbers_sorted[i + 1];
        if (next != (current + 1)) {
            return current + 1;
        }
    }
    return null;
}


if (require.main === module) {
    let strange_binary_numbers = read_file_of_strings("input/day05");
    let values = strange_binary_numbers.map(parse_strange_binary_number);
    console.log("Part 1: ", Math.max(...values));
    console.log("Part 2: ", find_gap_in_numbers(values));
}
