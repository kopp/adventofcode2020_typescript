
let input: number[] = [
    1721,
    979,
    366,
    299,
    675,
    1456,
];

let expected_product_of_two = 514579;
let expected_product_of_three = 241861950;

function product_of_two_elements_summing_up_to(input: number[], expected_sum: number): number {
    for (var i = 0; i < input.length - 1; ++i) {
        for (var j = i + 1; j < input.length; ++j) {
            let sum = input[i] + input[j];
            if (sum == expected_sum) {
                return input[i] * input[j];
            }
        }
    }
    throw new Error("Unable to find numbers umming up to " + expected_sum);
}

function product_of_three_elements_summing_up_to(input: number[], expected_sum: number): number {
    let sorted_input = input.sort((a, b) => a - b);
    for (var index_large_value = sorted_input.length - 1; index_large_value > 2; --index_large_value) {
        for (var index_small_value = 0; index_small_value < index_large_value - 1; ++index_small_value) {
            let partial_sum = sorted_input[index_large_value] + sorted_input[index_small_value];
            if (partial_sum > expected_sum) {
                console.log("Skipping because of partial sum ", partial_sum);
                continue;
            }
            var index_intermediate_value = Math.floor((index_large_value + index_small_value) / 2);
            var intermediates_tried: number[] = [];
            while ((index_intermediate_value > index_small_value) && (index_intermediate_value < index_large_value)) {
                var current_sum = sorted_input[index_intermediate_value] + partial_sum;
                if (current_sum == expected_sum) {
                    return sorted_input[index_large_value] * sorted_input[index_small_value] * sorted_input[index_intermediate_value];
                }
                else
                {
                    if (current_sum < expected_sum) {
                        index_intermediate_value++;
                    }
                    else {
                        index_intermediate_value--;
                    }
                }
                if (intermediates_tried.includes(index_intermediate_value)){
                    break;
                }
                else {
                    intermediates_tried.push(index_intermediate_value);
                }
                console.log(current_sum, index_small_value, index_intermediate_value, index_large_value);
            }
        }
    }
    throw new Error("Unable to find numbers umming up to " + expected_sum);
}


import { readFileSync } from 'fs';

function read_file_of_numbers(filename: string): number[] {
    let content: string = readFileSync(filename,'utf8');
    var numbers: number[] = [];
    for (let line of content.split("\n")) {
        let integer = parseInt(line);
        if (Number.isNaN(integer)) {
            console.log("Skipping input line ", line);
        }
        else {
            numbers.push(integer);
        }
    }
    return numbers;
}

console.log("Test");
console.log(expected_product_of_two == product_of_two_elements_summing_up_to(input, 2020));
console.log(expected_product_of_three == product_of_three_elements_summing_up_to(input, 2020));

let data = read_file_of_numbers("input/day01");
console.log("Solutions");
console.log(product_of_two_elements_summing_up_to(data, 2020));
console.log(product_of_three_elements_summing_up_to(data, 2020));
