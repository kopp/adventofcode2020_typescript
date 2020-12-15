import { ElveGame } from "../src/day15";

test("initial example", () => {
    const game = new ElveGame([0, 3, 6]);
    expect(game.calculate_next_number()).toBe(0);
    expect(game.calculate_next_number()).toBe(3);
    expect(game.calculate_next_number()).toBe(3);
    expect(game.calculate_next_number()).toBe(1);
    expect(game.calculate_next_number()).toBe(0);
    expect(game.calculate_next_number()).toBe(4);
    expect(game.calculate_next_number()).toBe(0);
});

test("2020 examples", () => {
    expect(new ElveGame([1,3,2]).calculate_2020th_number()).toBe(1);
    expect(new ElveGame([2,1,3]).calculate_2020th_number()).toBe(10);
    expect(new ElveGame([1,2,3]).calculate_2020th_number()).toBe(27);
    expect(new ElveGame([2,3,1]).calculate_2020th_number()).toBe(78);
    expect(new ElveGame([3,2,1]).calculate_2020th_number()).toBe(438);
    expect(new ElveGame([3,1,2]).calculate_2020th_number()).toBe(1836);
});