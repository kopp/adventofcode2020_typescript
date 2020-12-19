import { count_matches_in, parse_input, build_regexp_from } from "../src/day19";


test("Simple example", () => {
    const input = [
        "0: 1 2",
        "1: \"a\"",
        "2: 1 3 | 3 1",
        "3: \"b\"",
        "aab", // should match
        "aba", // should match
        "bba",
        "bab",
        "a",
        "b",
        "ab",
        "ba",
        "aaa",
        "bbb",
    ];

    expect(count_matches_in(input)).toBe(2);
});


test("More complex example", () => {
    const input = [
        "0: 4 1 5",
        "1: 2 3 | 3 2",
        "2: 4 4 | 5 5",
        "3: 4 5 | 5 4",
        "4: \"a\"",
        "5: \"b\"",
        // should match
        "aaaabb",
        "aaabab",
        "abbabb",
        "abbbab",
        "aabaab",
        "aabbbb",
        "abaaab",
        "ababbb",
        // should not match
        "babbbb",
        "ababba",
    ];

    expect(count_matches_in(input)).toBe(8);

    const [rules, inputs] = parse_input(input);
    const regexp = build_regexp_from(rules);

    for (const working of [
        "aaaabb",
        "aaabab",
        "abbabb",
        "abbbab",
        "aabaab",
        "aabbbb",
        "abaaab",
        "ababbb",
    ]) {
        expect(working.match(regexp)).toBeTruthy();
    }

    for (const failing of [
        "babbbb",
        "ababba",
        "bababa",
        "aaabbb",
        "aaaabbb",
    ]) {
        expect(failing.match(regexp)).toBeFalsy();
    }

});