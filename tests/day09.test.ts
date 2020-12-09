import {
    find_value_not_sum_of_two_numbers_from_preceeding_block,
    find_block_adding_up_to
} from "../src/day09";


let sample_input = [
    35,
    20,
    15,
    25,
    47,
    40,
    62,
    55,
    65,
    95,
    102,
    117,
    150,
    182,
    127,
    219,
    299,
    277,
    309,
    576,
]

test("find number that is not a sum of preceeding values", () => {
    expect(find_value_not_sum_of_two_numbers_from_preceeding_block(sample_input, 5)).toBe(127);
});


test("Find sub-block adding up to ...", () => {
    expect(find_block_adding_up_to(sample_input, 127).sumOfMinAndMax()).toBe(62);
})