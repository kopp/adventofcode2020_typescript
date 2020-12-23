import { CupGame } from "../src/day23";


test("Example part 1", () => {
    const input = [3,8,9,1,2,5,4,6,7];

    const game = new CupGame(input);
    game.play_steps(1);

    expect(game.cups[game.index_current_cup]).toBe(2);
    game.play_steps(1);
    expect(game.cups[game.index_current_cup]).toBe(5);
    game.play_steps(1);
    expect(game.cups[game.index_current_cup]).toBe(8);
})

test("Example part 1: final value", () => {
    const input = [3,8,9,1,2,5,4,6,7];

    const game = new CupGame(input);
    game.play_steps(10);
    expect(game.cup_order()).toEqual("92658374");
    game.play_steps(90);
    expect(game.cup_order()).toEqual("67384529");
})