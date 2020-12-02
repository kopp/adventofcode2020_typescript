import {
    repeats_letter_accepted_number_of_times,
    letter_at_exactly_one_indicated_positions,
    count_if
} from "../src/day02";


let test_input = [
    "1-3 a: abcde",
    "1-3 b: cdefg",
    "2-9 c: ccccccccc",
];
test("Example Part 1", () => {
    expect(repeats_letter_accepted_number_of_times(test_input[0])).toBeTruthy();
    expect(repeats_letter_accepted_number_of_times(test_input[1])).toBeFalsy();
    expect(repeats_letter_accepted_number_of_times(test_input[2])).toBeTruthy();
    expect(count_if(test_input, repeats_letter_accepted_number_of_times)).toBe(2);

});

test("Example Part 2", () => {
    expect(letter_at_exactly_one_indicated_positions(test_input[0])).toBeTruthy();
    expect(letter_at_exactly_one_indicated_positions(test_input[1])).toBeFalsy();
    expect(letter_at_exactly_one_indicated_positions(test_input[2])).toBeFalsy();
    expect(count_if(test_input, letter_at_exactly_one_indicated_positions)).toBe(1);
});