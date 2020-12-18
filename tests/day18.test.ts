import { tokenize, evaluate } from "../src/day18";


test("Tokenize", () => {
    expect(tokenize("5")).toEqual(["5"]);
    expect(tokenize("(5")).toEqual(["(", "5"]);
    expect(tokenize("(5)")).toEqual(["(", "5", ")"]);
    expect(tokenize("(((5)))")).toEqual(["(", "(", "(", "5", ")", ")", ")"]);

    expect(tokenize("(((5 + 1)))")).toEqual(["(", "(", "(", "5", "+", "1", ")", ")", ")"]);
    expect(tokenize("(((5 + 1) * 312))")).toEqual(["(", "(", "(", "5", "+", "1", ")", "*", "312", ")", ")"]);
    expect(tokenize("1 + 10 + (100 + 1000)")).toEqual(["1", "+", "10", "+", "(", "100", "+", "1000", ")"]);
});


test("Evaluate", () => {
    expect(evaluate("5")).toBe(5);
    expect(evaluate("(5)")).toBe(5);
    expect(evaluate("(((5)))")).toBe(5);
    expect(evaluate("1 + 1")).toBe(2);
    expect(evaluate("1 + (1 + 1)")).toBe(3);

    expect(evaluate("1 + (2 * 3) + (4 * (5 + 6))")).toBe(51);
    expect(evaluate("2 * 3 + (4 * 5)")).toBe(26);
    expect(evaluate("5 + (8 * 3 + 9 + 3 * 4 * 3)")).toBe(437);
    expect(evaluate("5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))")).toBe(12240);
    expect(evaluate("((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2")).toBe(13632);

})