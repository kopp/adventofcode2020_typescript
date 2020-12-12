import { read_empty_line_and_whitespace_separated_strings } from "./read_file_utils";
import { intersect } from "./set_utils";



export function characters_in_any_of(strings: string[]): Set<string> {
    const sets: Array<Set<string>> = strings.map((value: string) => new Set(value));
    const union = sets.reduce((accumulation: Set<string>, currentValue: Set<string>) => accumulation = new Set([...accumulation, ...currentValue]));
    return union;
}

export function characters_in_all_of(strings: string[]): Set<string> {
    const sets: Array<Set<string>> = strings.map((value: string) => new Set(value));
    const union = sets.reduce((accumulation: Set<string>, currentValue: Set<string>) => accumulation = intersect(accumulation, currentValue));
    return union;
}


if (require.main === module) {
    const input = read_empty_line_and_whitespace_separated_strings("input/day06");

    {
        let sum_of_set_sizes = 0;
        input.forEach(element => sum_of_set_sizes += characters_in_any_of(element).size);
        console.log("Part 1: ", sum_of_set_sizes);
    }

    {
        let sum_of_set_sizes = 0;
        input.forEach(element => sum_of_set_sizes += characters_in_all_of(element).size);
        console.log("Part 2: ", sum_of_set_sizes);
    }
}