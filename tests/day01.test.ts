import {
    product_of_two_elements_summing_up_to,
    product_of_three_elements_summing_up_to
} from "../src/day01";


let input: number[] = [
    1721,
    979,
    366,
    299,
    675,
    1456,
];

const expected_product_of_two = 514579;
const expected_product_of_three = 241861950;

test("Example Part 1", () => {
    expect(product_of_two_elements_summing_up_to(input, 2020)).toBe(expected_product_of_two);
});

test("Example Part 2", () => {
    expect(product_of_three_elements_summing_up_to(input, 2020)).toBe(expected_product_of_three);
});