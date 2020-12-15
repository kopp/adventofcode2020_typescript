import { read_file_of_numbers } from "./read_file_utils";


export class ElveGame
{
    /**
     * This does not include the index for the last_number!
     */
    last_index_for: Map<number, number> = new Map();
    last_number: number;
    number_of_known_numbers: number;

    constructor(start_numbers: Array<number>)
    {
        if (new Set(start_numbers).size != start_numbers.length) {
            throw new Error("Expected non-repeating values as stringing numbers.");
        }

        // Note: do not include the last number in the map!
        for (let index = 0; index < start_numbers.length - 1; ++index) {
            const value = start_numbers[index];
            this.last_index_for.set(value, index);
        }
        this.number_of_known_numbers = start_numbers.length;
        this.last_number = start_numbers[start_numbers.length - 1];
    }

    calculate_next_number(): number
    {
        const index_for_last_number = this.number_of_known_numbers - 1;
        const previous_index_for_last_number = this.last_index_for.get(this.last_number);
        let next_number;
        if (previous_index_for_last_number == undefined) {
            next_number = 0;
        }
        else {
            next_number = index_for_last_number - previous_index_for_last_number;
        }
        this.last_index_for.set(this.last_number, index_for_last_number);
        this.number_of_known_numbers += 1;
        this.last_number = next_number;
        return next_number;
    }

    calculate_nth_number(n: number, logging: boolean = false): number
    {
        const begin = Date.now();
        while (this.number_of_known_numbers < n) {
            const value = this.calculate_next_number();
            if (logging) {
                console.log(this.number_of_known_numbers, Date.now() - begin, value);
            }
        }
        return this.last_number;
    }

    calculate_2020th_number(): number
    {
        return this.calculate_nth_number(2020);
    }

    calculate_30000000th_number(): number
    {
        return this.calculate_nth_number(30000000);
    }

}


if (require.main === module)
{
    const input = [0, 14, 6, 20, 1, 4]

    const game = new ElveGame(input);
    console.log("Problem 1: ", game.calculate_2020th_number());
    console.log("Problem 2: ", game.calculate_30000000th_number());
}