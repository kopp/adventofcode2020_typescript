import {
    get_all_valid_values,
    get_invalid_values_in_nearby_tickets,
    determine_field_per_index,
    get_valid_ticket_values,
    get_all_fields,
    Field,
} from "../src/day16";


const test_input = [
    "class: 1-3 or 5-7",
    "row: 6-11 or 33-44",
    "seat: 13-40 or 45-50",
    "",
    "your ticket:",
    "7,1,14",
    "",
    "nearby tickets:",
    "7,3,47",
    "40,4,50",
    "55,2,20",
    "38,6,12",
];

const valid_values_in_test_input = new Set([
    1,2,3,  5,6,7,
    6,7,8,9,10,11,    33,32,33,34,35,36,37,38,39,40,41,42,43,44,
    13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,    45,46,47,48,49,50,
]);

const invalid_values_in_test_input = [4, 55, 12];


test("valid values in test input", () => {
    expect(get_all_valid_values(test_input)).toEqual(valid_values_in_test_input);
});

test("find invalid values in test input", () => {
    expect(get_invalid_values_in_nearby_tickets(test_input, valid_values_in_test_input)).toEqual(invalid_values_in_test_input);
})


const test_input_part2 = [
    "class: 0-1 or 4-19",
    "row: 0-5 or 8-19",
    "seat: 0-13 or 16-19",
    "your ticket:",
    "11,12,13",
    "nearby tickets:",
    "3,9,18",
    "99,1,2",  // invalid
    "15,1,5",
    "20,4,9",  // invalid
    "5,14,9",
];


test("get valid tickets", () => {
    const allowed_values = get_all_valid_values(test_input_part2);
    expect(get_valid_ticket_values(test_input_part2, allowed_values)).toEqual(
        [
            [3, 9, 18,],
            [15, 1, 5,],
            [5, 14, 9,],
        ]
    );
});


test("get fields", () => {
    const all_fields = get_all_fields(test_input_part2);
    expect(all_fields.size).toBe(3);

    const field_names = new Set([...all_fields].map(field => field.name));
    expect(field_names).toEqual(new Set(["class", "row", "seat"]));

    let class_field: Field;
    for (let field of all_fields) {
        if (field.name === "class") {
            class_field = field;
        }
    }
    expect(class_field!.name).toEqual("class");
    expect(class_field!.is_valid(0)).toBeTruthy();
    expect(class_field!.is_valid(1)).toBeTruthy();
    expect(class_field!.is_valid(2)).toBeFalsy();
    expect(class_field!.is_valid(3)).toBeFalsy();
    expect(class_field!.is_valid(4)).toBeTruthy();

});

test("association", () => {
    const allowed_values = get_all_valid_values(test_input_part2);
    const valid_tickets = get_valid_ticket_values(test_input_part2, allowed_values);
    const all_fields = get_all_fields(test_input_part2);

    const solution = determine_field_per_index(valid_tickets, all_fields);
    expect(solution.get(0)!.name).toEqual("row");
    expect(solution.get(1)!.name).toEqual("class");
    expect(solution.get(2)!.name).toEqual("seat");
});