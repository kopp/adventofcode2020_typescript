import { Game } from "../src/day22";


test("Example game", () => {
    const game = new Game([9, 2, 6, 3, 1], [5, 8, 4, 7, 10]);
    while (! game.is_finished()) {
        game.play_one_round();
    }
    expect(game.winning_score()).toBe(306);
});