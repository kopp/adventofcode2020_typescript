import { readFileSync } from 'fs';

function read_file_of_strings(filename: string): string[] {
    let content: string = readFileSync(filename,'utf8');
    var strings: string[] = [];
    for (let line of content.split("\n")) {
        if (line.length > 0) {
            strings.push(line);
        }
    }
    return strings;
}


let parse_line = /(\d+)-(\d+) (.): (.+)/;


function count_occurances_of(character: string, in_string: string): number {
    var occurances = 0;
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
    let match = line.match(parse_line);
    if (match === null) {
        console.log("Unable to process line ", line);
        return false;
    }
    else {
        let min_occurances = parseInt(match[1]);
        let max_occurances = parseInt(match[2]);
        let character = match[3];
        let string_to_check = match[4];
        let occurances = count_occurances_of(character, string_to_check);
        let is_occurances_ok = (min_occurances <= occurances) && (occurances <= max_occurances);
        return is_occurances_ok;
    }
}

// part 2
export function letter_at_exactly_one_indicated_positions(line: string): boolean {
    let match = line.match(parse_line);
    if (match === null) {
        console.log("Unable to process line ", line);
        return false;
    }
    else {
        let index_first_occurance = parseInt(match[1]);
        let index_second_occurance = parseInt(match[2]);
        let character = match[3];
        let string_to_check = match[4];
        let is_at_first_index = string_to_check[index_first_occurance - 1] == character;
        let is_at_second_index = string_to_check[index_second_occurance - 1] == character;
        return xor(is_at_first_index, is_at_second_index);
    }
}


interface PredicateOnString {
    (arg: string): boolean;
};

export function count_if(strings_to_operate_on: string[], predicate: PredicateOnString): number {
    var count_predicate_true = 0;
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