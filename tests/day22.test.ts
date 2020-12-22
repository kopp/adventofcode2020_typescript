import { Game } from "../src/day22";


test("Example game simple", () => {
    const game = new Game([9, 2, 6, 3, 1], [5, 8, 4, 7, 10], false);
    game.play_game();
    expect(game.winning_score()).toBe(306);
});


test("Example game recursive", () => {
    const game = new Game([9, 2, 6, 3, 1], [5, 8, 4, 7, 10], true);
    game.play_game();
    expect(game.winning_score()).toBe(291);
});