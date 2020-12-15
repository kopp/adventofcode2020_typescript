import { read_file_of_numbers } from "./read_file_utils";


export class ElveGame
{
    numbers: Array<number>;

    constructor(start_numbers: Array<number>)
    {
        this.numbers = start_numbers;
    }

    /**
     * Find the last (closest to the end) occurance of the value at the end or
     * null if that number occured the first time.
     */
    last_occurance_of_last_value(): number | null
    {
        const last_number = this.numbers[this.numbers.length - 1];
        for (let i = this.numbers.length - 2; i >= 0; --i) {
            if (this.numbers[i] == last_number) {
                return i;
            }
        }
        return null;
    }

    calculate_next_number(): number
    {
        const index_for_last_number = this.numbers.length - 1;
        const last_number = this.numbers[index_for_last_number];
        const previous_index_for_last_number = this.last_occurance_of_last_value();
        let next_number;
        if (previous_index_for_last_number == null) {
            next_number = 0;
        }
        else {
            next_number = index_for_last_number - previous_index_for_last_number;
        }
        this.numbers.push(next_number);
        return next_number;
    }

    calculate_2020th_number(): number
    {
        while (this.numbers.length < 2020) {
            this.calculate_next_number();
        }
        return this.numbers[2019];
    }
}


if (require.main === module)
{
    const input = [0, 14, 6, 20, 1, 4]

    const game = new ElveGame(input);
    console.log("Problem 1: ", game.calculate_2020th_number());
}