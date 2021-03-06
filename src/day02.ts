import { read_file_of_strings } from "./read_file_utils";

let parse_line = /(\d+)-(\d+) (.): (.+)/;


function count_occurances_of(character: string, in_string: string): number {
    let occurances = 0;
    for (let character_in_string of in_string) {
        if (character_in_string == character) {
            occurances += 1;
        }
    }
    return occurances;
}


function xor(a: boolean, b: boolean): boolean {
    return (a && !b) || (!a && b);
}

// part 1
export function repeats_letter_accepted_number_of_times(line: string): boolean {
    const match = line.match(parse_line);
    if (match === null) {
        console.log("Unable to process line ", line);
        return false;
    }
    else {
        const min_occurances = parseInt(match[1]);
        const max_occurances = parseInt(match[2]);
        const character = match[3];
        const string_to_check = match[4];
        const occurances = count_occurances_of(character, string_to_check);
        const is_occurances_ok = (min_occurances <= occurances) && (occurances <= max_occurances);
        return is_occurances_ok;
    }
}

// part 2
export function letter_at_exactly_one_indicated_positions(line: string): boolean {
    const match = line.match(parse_line);
    if (match === null) {
        console.log("Unable to process line ", line);
        return false;
    }
    else {
        const index_first_occurance = parseInt(match[1]);
        const index_second_occurance = parseInt(match[2]);
        const character = match[3];
        const string_to_check = match[4];
        const is_at_first_index = string_to_check[index_first_occurance - 1] == character;
        const is_at_second_index = string_to_check[index_second_occurance - 1] == character;
        return xor(is_at_first_index, is_at_second_index);
    }
}


interface PredicateOnString {
    (arg: string): boolean;
};

export function count_if(strings_to_operate_on: string[], predicate: PredicateOnString): number {
    let count_predicate_true = 0;
    for (let string_under_evaluation of strings_to_operate_on) {
        if (predicate(string_under_evaluation)) {
            count_predicate_true += 1;
        }
    }
    return count_predicate_true;
}


if (require.main === module) {
    let problem_input = read_file_of_strings("input/day02");
    console.log("Part 1: ", count_if(problem_input, repeats_letter_accepted_number_of_times));
    console.log("Part 2: ", count_if(problem_input, letter_at_exactly_one_indicated_positions));
}