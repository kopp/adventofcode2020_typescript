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

test("30000000 one example", () => {
    expect(new ElveGame([0,3,6]).calculate_30000000th_number()).toBe(175594);
});

test.skip("30000000 more examples -- skipped by default", () => {
    expect(new ElveGame([1,3,2]).calculate_30000000th_number()).toBe(2578);
    expect(new ElveGame([2,1,3]).calculate_30000000th_number()).toBe(3544142);
    expect(new ElveGame([1,2,3]).calculate_30000000th_number()).toBe(261214);
    expect(new ElveGame([2,3,1]).calculate_30000000th_number()).toBe(6895259);
    expect(new ElveGame([3,2,1]).calculate_30000000th_number()).toBe(18);
    expect(new ElveGame([3,1,2]).calculate_30000000th_number()).toBe(362);
});