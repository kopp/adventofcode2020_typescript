import {
    tokenize,
    evaluate_without_precedence,
    evaluate_with_plus_precedence,
} from "../src/day18";


test("Tokenize", () => {
    expect(tokenize("5")).toEqual(["5"]);
    expect(tokenize("(5")).toEqual(["(", "5"]);
    expect(tokenize("(5)")).toEqual(["(", "5", ")"]);
    expect(tokenize("(((5)))")).toEqual(["(", "(", "(", "5", ")", ")", ")"]);

    expect(tokenize("(((5 + 1)))")).toEqual(["(", "(", "(", "5", "+", "1", ")", ")", ")"]);
    expect(tokenize("(((5 + 1) * 312))")).toEqual(["(", "(", "(", "5", "+", "1", ")", "*", "312", ")", ")"]);
    expect(tokenize("1 + 10 + (100 + 1000)")).toEqual(["1", "+", "10", "+", "(", "100", "+", "1000", ")"]);
});


test("Evaluate without precedence", () => {
    expect(evaluate_without_precedence("5")).toBe(5);
    expect(evaluate_without_precedence("(5)")).toBe(5);
    expect(evaluate_without_precedence("(((5)))")).toBe(5);
    expect(evaluate_without_precedence("1 + 1")).toBe(2);
    expect(evaluate_without_precedence("1 + (1 + 1)")).toBe(3);

    expect(evaluate_without_precedence("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
    expect(evaluate_without_precedence("2 * 3 + (4 * 5)")).toBe(26);
    expect(evaluate_without_precedence("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(437);
    expect(evaluate_without_precedence("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(12240);
    expect(evaluate_without_precedence("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toBe(13632);
})


test("Evaluate with + precedence", () => {
    expect(evaluate_with_plus_precedence("5")).toBe(5);
    expect(evaluate_with_plus_precedence("(5)")).toBe(5);
    expect(evaluate_with_plus_precedence("(((5)))")).toBe(5);
    expect(evaluate_with_plus_precedence("1 + 1")).toBe(2);
    expect(evaluate_with_plus_precedence("1 + (1 + 1)")).toBe(3);

    expect(evaluate_with_plus_precedence("1 + 2 * 3 + 4 * 5 + 6")).toBe(231);
    expect(evaluate_with_plus_precedence("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
    expect(evaluate_with_plus_precedence("2 * 3 + (4 * 5)")).toBe(46);
    expect(evaluate_with_plus_precedence("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(1445);
    expect(evaluate_with_plus_precedence("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(669060);
    expect(evaluate_with_plus_precedence("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toBe(23340);
});