import { read_file_of_numbers } from "./read_file_utils";


export function find_value_not_sum_of_two_numbers_from_preceeding_block(numbers: number[], block_length: number): number
{
    function is_value_sum_of_two_numbers_from_preceeding_block(index: number): boolean {
        let expected_sum = numbers[index];
        for (let i = index - block_length; i < index - 1; ++i) {
            for (let j = i - 1; j < index; ++j) {
                let sum = numbers[i] + numbers[j];
                if (expected_sum == sum) {
                    return true;
                }
            }
        }
        return false;
    }

    for (let index = block_length; index < numbers.length; ++index) {
        if (! is_value_sum_of_two_numbers_from_preceeding_block(index)) {
            return numbers[index];
        }
    }

    throw new Error("Unable to find the value.");
}


/**
 * Block of numbers in a long array of numbers.
 */
class SubBlock
{
    numbers: number[];
    start_index = 0;
    end_index = 1;  /** one behind last element in SubBlock */
    sum: number;

    constructor(numbers: number[])
    {
        this.numbers = numbers;
        const first_sub_block = numbers.slice(this.start_index, this.end_index);
        this.sum = first_sub_block.reduce((accumulator, value) => accumulator + value, 0);
    }

    incrementStartIndex() {
        this.sum -= this.numbers[this.start_index];
        this.start_index += 1;
    }

    incrementEndIndex() {
        this.sum += this.numbers[this.end_index];
        this.end_index += 1;
    }

    sumOfMinAndMax(): number {
        const numbers_to_consider = this.numbers.slice(this.start_index, this.end_index);
        const min = Math.min(...numbers_to_consider);
        const max = Math.max(...numbers_to_consider);
        return min + max;
    }

}


/**
 * @returns block of numbers that add up to value
 */
export function find_block_adding_up_to(numbers: number[], value: number): SubBlock
{
    let sliding_window = new SubBlock(numbers);
    while (sliding_window.end_index < numbers.length) {
        if (sliding_window.sum < value) {
            sliding_window.incrementEndIndex();
        }
        if (sliding_window.sum > value) {
            sliding_window.incrementStartIndex();
        }
        if (sliding_window.sum == value) {
            return sliding_window;
        }
    }
    throw new Error("Unable to find SubBlock.");
}


if (require.main === module) {
    let input = read_file_of_numbers("input/day09");

    const solution1 = find_value_not_sum_of_two_numbers_from_preceeding_block(input, 25);
    console.log("Part 1: ", solution1);

    const solution2 = find_block_adding_up_to(input, solution1);
    console.log("Part 2: ", solution2.sumOfMinAndMax());
}