import { read_file_of_strings } from "./read_file_utils";


const trance_logging = false;


export class Field
{
    constructor(
        public name: string,
        private min1: number,
        private max1: number,
        private min2: number,
        private max2: number)
    {
    }

    is_valid(value: number): boolean
    {
        return ((this.min1 <= value) && (value <= this.max1)) || ((this.min2 <= value) && (value <= this.max2));
    }

    add_valid_numbers_to(set: Set<number>): void
    {
        for (let i = this.min1; i <= this.max1; ++i) {
            set.add(i);
        }
        for (let i = this.min2; i <= this.max2; ++i) {
            set.add(i);
        }
    }
}


/**
 * Help to find the association between index and field.
 * At the beginning, we do not have any information about the association.
 * If we find, that a value for a given index is not allowed for a field, we
 * can exclude this field from the possible fields for this index.
 */
class PossibleFieldsForIndex
{
    possible_fields_for_index = new Map<number, Set<Field>>();
    known_solution = new Map<number, Field>();

    constructor(
        public number_of_indices: number,
        all_fields: Set<Field>
    )
    {
        for (let index = 0; index < number_of_indices; ++index) {
            // one copy for each index so that we can modify them per index
            let copy_of_all_fields = new Set([...all_fields]);
            this.possible_fields_for_index.set(index, copy_of_all_fields);
        }
    }


    /**
     * If we know one association, remove this field from the possibilities of
     * all other indices.
     */
    private propagate_known_solutions()
    {
        let solved_fields = new Array<Field>();

        // update known solution
        for (let index = 0; index < this.number_of_indices; ++index) {
            const possible_fields = this.possible_fields_for(index);
            if (possible_fields.size == 1) {
                const value_in_set = possible_fields.values().next();
                const field: Field = value_in_set.value;
                if (this.known_solution.has(index)) {
                    if (this.known_solution.get(index)! !== field) {
                        throw new Error("Solutions do not match.");
                    }
                }
                else {
                    this.known_solution.set(index, field);
                }
                solved_fields.push(field);
            }
        }

        let rerun = false;
        for (let index = 0; index < this.number_of_indices; ++index) {
            const possible_fields = this.possible_fields_for(index);
            const index_is_not_yet_solved = possible_fields.size > 1;
            if (index_is_not_yet_solved) {
                for (const field of solved_fields) {
                    const was_removed = possible_fields.delete(field);
                    if (was_removed && trance_logging) {
                        console.log(`Removed field ${field.name} for index ${index}.`);
                    }
                }
                // afterwards, check the new size
                const index_is_solved_now = possible_fields.size == 1;
                if (index_is_solved_now) {
                    rerun = true;
                }
                if (possible_fields.size < 1) {
                    throw new Error(`Removed too much possibilities, now no possibilities for index ${index} any more.`);
                }
            }
        }

        if (rerun) {
            this.propagate_known_solutions();
        }
    }

    /**
     * @returns if something changed
     */
    reduce_possibilities_with_valid_input(input: Array<number>): boolean
    {
        let something_changed = false;
        for (let index = 0; index < this.number_of_indices; ++index) {
            const value = input[index];
            let possible_fields = this.possible_fields_for(index);

            for (let possible_field of possible_fields) {
                if (! possible_field.is_valid(value)) {
                    possible_fields.delete(possible_field);
                    something_changed = true;
                }
            }
        }

        // incorporate new findings
        if (something_changed) {
            this.propagate_known_solutions();
        }
        return something_changed;
    }

    private possible_fields_for(index: number): Set<Field>
    {
        let possible_fields = this.possible_fields_for_index.get(index);
        if (possible_fields == undefined) {
            throw new Error(`Index ${index} is not found.`);
        }
        else if (possible_fields.size == 0) {
            throw new Error(`Index ${index} has no possible fields.`);
        }
        return possible_fields;
    }


    /**
     * @returns null if no solution yet or the single solution
     */
    solution(): Map<number, Field> | null
    {
        let solution = new Map<number, Field>();
        for (let index = 0; index < this.number_of_indices; ++index) {
            const possible_fields = this.possible_fields_for(index);
            if (possible_fields.size > 1) {
                return null;
            }
            else {
                let value_in_set = possible_fields.values().next();
                solution.set(index, value_in_set.value);
            }
        }
        return solution;
    }
}


/**
 * Find for each index what field is associated.
 */
export function determine_field_per_index(valid_tickets: Array<Array<number>>, all_fields: Set<Field>): Map<number, Field>
{
    const number_of_indices = valid_tickets[0].length;
    let possible_fields = new PossibleFieldsForIndex(number_of_indices, all_fields);

    for (const ticket of valid_tickets)
    {
        const somethign_changed = possible_fields.reduce_possibilities_with_valid_input(ticket);
        if (somethign_changed) {
            const possible_solution = possible_fields.solution();
            if (possible_solution != null) {
                return possible_solution;
            }
        }
    }

    throw new Error("Unable to find a solution.");
}


export function get_all_fields(input: Array<string>): Set<Field>
{
    let fields: Set<Field> = new Set<Field>();

    for (const line of input) {
        if ((line.length == 0) || (line.startsWith("your ticket:"))) {
            return fields;
        }

        const match = line.match(/^(.*): (\d+)-(\d+) or (\d+)-(\d+)$/);
        if (match == null) {
            throw new Error(`Unable to parse line ${line} as allowed values.`);
        }

        const name = match[1];
        const min1 = parseInt(match[2]);
        const max1 = parseInt(match[3]);
        const min2 = parseInt(match[4]);
        const max2 = parseInt(match[5]);

        let new_field = new Field(name, min1, max1, min2, max2);
        fields.add(new_field);
    }
    throw new Error("Expected empty line or 'your ticket' after allowed values.")
}


/**
 * Return all values that are valid in at least one field.
 */
export function get_all_valid_values(input: Array<string>): Set<number>
{
    let valid_values = new Set<number>();
    const fields = get_all_fields(input);
    for (let field of fields) {
        field.add_valid_numbers_to(valid_values);
    }
    return valid_values;
}


/**
 * Get each line of valid inputs as array of numbers.
 */
export function get_valid_ticket_values(input: Array<string>, allowed_values: Set<number>): Array<Array<number>>
{
    let valid_values = new Array<Array<number>>();

    let ignore_line = true;
    for (const line of input) {
        if (line === "nearby tickets:") {
            ignore_line = false;
            continue
        }
        if (ignore_line) {
            continue;
        }

        const numbers_as_string = line.split(",");
        let all_values_valid = true;
        let numbers_as_array = new Array<number>();
        for (const number_as_string of numbers_as_string) {
            const number = parseInt(number_as_string);
            numbers_as_array.push(number);
            if (! allowed_values.has(number)) {
                all_values_valid = false;
                break;
            }
        }
        if (all_values_valid) {
            valid_values.push(numbers_as_array);
        }
    }

    return valid_values;
}


export function get_invalid_values_in_nearby_tickets(input: Array<string>, allowed_values: Set<number>): Array<number>
{
    let invalid_values = new Array<number>();

    let ignore_line = true;
    for (const line of input) {
        if (line === "nearby tickets:") {
            ignore_line = false;
            continue
        }
        if (ignore_line) {
            continue;
        }

        const numbers_as_string = line.split(",");
        for (const number_as_string of numbers_as_string) {
            const number = parseInt(number_as_string);
            if (! allowed_values.has(number)) {
                invalid_values.push(number);
            }
        }
    }

    return invalid_values;
}


/**
 * Using the solution mapping, extract the "departure*" fields of "your ticket"
 * and return the product of those.
 */
function multiply_your_tickets_departure_values(input: Array<string>, solution: Map<number, Field>): number
{
    let use_next_line: boolean = false;
    let your_ticket: string | null = null;
    for (const line of input) {
        if (line === "your ticket:") {
            use_next_line = true;
            continue;
        }
        if (! use_next_line) {
            continue;
        }
        if (use_next_line) {
            your_ticket = line;
            break;
        }
    }
    if (your_ticket == null) {
        throw new Error("Unable to extract the 'your ticket'.");
    }

    const ticket_values = your_ticket.split(",").map(value => parseInt(value));

    let product = 1;
    for (let index = 0; index < ticket_values.length; ++index) {
        const field = solution.get(index);
        if (field == null) {
            throw new Error(`Index ${index} is not part of the solution.`);
        }
        if (field.name.startsWith("departure")) {
            const value = ticket_values[index];
            product = product * value;
        }
    }

    return product;
}


if (require.main === module) {
    const input = read_file_of_strings("input/day16");

    const allowed_values = get_all_valid_values(input);
    const invalid_nearby_values = get_invalid_values_in_nearby_tickets(input, allowed_values);

    const sum = invalid_nearby_values.reduce((previous, current) => previous + current, 0);

    console.log("Problem 1: ", sum);


    const valid_tickets = get_valid_ticket_values(input, allowed_values);
    const all_fields = get_all_fields(input);
    const solution_association = determine_field_per_index(valid_tickets, all_fields);
    const product = multiply_your_tickets_departure_values(input, solution_association);

    console.log("Problem 2: ", product);
}