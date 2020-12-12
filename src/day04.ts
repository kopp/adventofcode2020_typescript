import { assert } from "console";
import { read_empty_line_and_whitespace_separated_strings } from "./read_file_utils";


function is_subset<T>(possible_subset: Set<T>, possible_superset: Set<T>) : boolean {
    for (let elem of possible_subset) {
        if (! possible_superset.has(elem)) {
            return false;
        }
    }
    return true;
}


function parse_number_with_unit(length_as_text: string, unit: string) : number | null {
    if (length_as_text.endsWith(unit)) {
        return parseInt(length_as_text.substring(0, length_as_text.length - unit.length));
    }
    return null;
}


export function is_hex_color(possible_color: string) {
    return possible_color.match(/^#[0-9a-f]{6}$/);
}

class Passport {
    static REQUIRED_KEYS = new Set([
        "byr",
        "iyr",
        "eyr",
        "hgt",
        "hcl",
        "ecl",
        "pid",
    ])

    static ALLOWED_EYE_COLORS = new Set(["amb", "blu", "brn", "gry", "grn", "hzl", "oth"]);

    content: Map<string, string> = new Map();

    constructor(content: Array<string>) {
        for (let key_value_pair of content) {
            const key_and_value = key_value_pair.split(":");
            assert(key_and_value.length == 2, `Unable to parse key value pair "${key_value_pair}"`);
            this.content.set(key_and_value[0], key_and_value[1]);
        }
    }

    is_keys_valid(): boolean {
        const set_of_keys = new Set(this.content.keys());
        const has_required_keys = is_subset(Passport.REQUIRED_KEYS, set_of_keys);
        return has_required_keys;
    }

    is_values_valid(): boolean {
        if (! this.is_keys_valid()) { return false; }

        // byr (Birth Year) - four digits; at least 1920 and at most 2002.
        const birth_year = parseInt(this.content.get("byr")!);
        if ((birth_year < 1920) || (birth_year > 2002)) { return false; }
        // iyr (Issue Year) - four digits; at least 2010 and at most 2020.
        const issue_year = parseInt(this.content.get("iyr")!);
        if ((issue_year < 2010) || (issue_year > 2020)) { return false; }
        // eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
        const expiration_year = parseInt(this.content.get("eyr")!);
        if ((expiration_year < 2020) || (expiration_year > 2030)) { return false; }
        // hgt (Height) - a number followed by either cm or in:
        //    If cm, the number must be at least 150 and at most 193.
        //    If in, the number must be at least 59 and at most 76.
        const height_cm = parse_number_with_unit(this.content.get("hgt")!, "cm");
        if (height_cm === null) {
            const height_in = parse_number_with_unit(this.content.get("hgt")!, "in");
            if (height_in === null) { return false; } // neither in cm nor in in!
            else {
                if ((height_in < 59) || (height_in > 76)) { return false; }
            }
        }
        else {
            if ((height_cm < 150) || (height_cm > 193)) { return false; }
        }
        // hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
        if (! is_hex_color(this.content.get("hcl")!)) { return false; }
        // ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
        if (! Passport.ALLOWED_EYE_COLORS.has(this.content.get("ecl")!)) { return false; }
        // pid (Passport ID) - a nine-digit number, including leading zeroes.
        if (! this.content.get("pid")?.match(/^[0-9]{9}$/)) { return false; }

        return true;
    }
}


interface PredicateOnPassport {
    (arg: Passport): any;
};


function foreach_passport(data_all_passports: Array<Array<string>>, predicate: PredicateOnPassport) {
    for (let passport_data of data_all_passports) {
        let passport = new Passport(passport_data);
        predicate(passport);
    }
}


export function count_passports_with_valid_keys(data_all_passports: Array<Array<string>>): number {
    let count: number = 0;
    for (let passport_data of data_all_passports) {
        let passport = new Passport(passport_data);
        if (passport.is_keys_valid()) {
            count += 1;
        }
    }
    return count;
}


export function count_passports_with_valid_values(data_all_passports: Array<Array<string>>): number {
    let count: number = 0;
    for (let passport_data of data_all_passports) {
        let passport = new Passport(passport_data);
        if (passport.is_values_valid()) {
            count += 1;
        }
    }
    return count;
}



export function Xcount_passports_with_valid_values(data_all_passports: Array<Array<string>>): number {
    let count = 0;
    function count_valid_values(passport: Passport) {
        if (passport.is_values_valid()) {
            count += 1;
        }
    }
    foreach_passport(data_all_passports, count_valid_values);
    return count;
}


if (require.main === module) {
    const all_passports = read_empty_line_and_whitespace_separated_strings("input/day04");
    console.log("Part 1: ", count_passports_with_valid_keys(all_passports));
    console.log("Part 2: ", count_passports_with_valid_values(all_passports));
}