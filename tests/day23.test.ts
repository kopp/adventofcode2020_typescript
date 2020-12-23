import { CupGame } from "../src/day23";


test("Example part 1", () => {
    const input = [3,8,9,1,2,5,4,6,7];

    const game = new CupGame(input);

    const current_values_for_some_steps = [3, 2, 5, 8, 4, 1, 9];
    for (const value of current_values_for_some_steps) {
        expect(game.current_cup.value).toBe(value);
        game.play_steps(1);
    }
})

test("Example part 1: final value", () => {
    const input = [3,8,9,1,2,5,4,6,7];

    const game = new CupGame(input);
    game.play_steps(10);
    expect(game.cup_order()).toEqual("92658374");
    game.play_steps(90);
    expect(game.cup_order()).toEqual("67384529");
})