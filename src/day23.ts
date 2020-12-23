class Cup
{
    value: number;
    next: Cup;

    constructor(value: number, next: Cup)
    {
        this.value = value;
        this.next = next;
    }
}

export class CupGame
{
    cup_with_value = new Map<number, Cup>();
    current_cup: Cup;
    highest_value: number;
    /** values missing between 1 and highest_value */
    missing_values = new Set<number>();

    constructor(cup_values: Array<number>)
    {
        const first_cup = new Cup(cup_values[0], null as unknown as Cup);  // first_cup is in invalid state now!
        this.cup_with_value.set(cup_values[0], first_cup);

        const last_value = cup_values[cup_values.length - 1];
        const last_cup = new Cup(last_value, first_cup);
        this.cup_with_value.set(last_value, last_cup);

        let next_cup = last_cup;
        for (let index = cup_values.length - 2; index >= 1; --index) {
            const value = cup_values[index];
            const cup = new Cup(value, next_cup);
            this.cup_with_value.set(value, cup);
            next_cup = cup;
        }
        first_cup.next = next_cup; // first_cup is valid now

        this.current_cup = first_cup;

        for (let assumed_contained_value = 1; assumed_contained_value <= cup_values.length; ++assumed_contained_value) {
            if (! this.cup_with_value.has(assumed_contained_value)) {
                this.missing_values.add(assumed_contained_value);
            }
        }

        this.highest_value = cup_values.length;
    }

    /**
     * @returns the first removed cup (which still points to the following cup -- the last of the three still points to the "old" next value!)
     */
    remove_three_cups_clockwise_of(cup: Cup): Cup
    {
        const following_cup = cup.next;
        const next_cup_to_keep = following_cup.next.next.next;
        cup.next = next_cup_to_keep;
        return following_cup;
    }

    insert_three_cups_clockwise_of(cup: Cup, first_of_the_three_cups: Cup): void
    {
        const following_cup = cup.next;
        const last_of_the_three_cups = first_of_the_three_cups.next.next;
        cup.next = first_of_the_three_cups;
        last_of_the_three_cups.next = following_cup;
    }

    private pick_next_lower_value(value: number): number
    {
        let next_value = value - 1;
        if (next_value === 0) {
            return this.highest_value;
        }
        else if (this.missing_values.has(next_value)) {
            return this.pick_next_lower_value(next_value);
        }
        else {
            return next_value;
        }
    };

    determine_destination_cup(first_of_the_three_removed_cups: Cup): Cup
    {
        const unpickable_values = new Set([
            first_of_the_three_removed_cups.value,
            first_of_the_three_removed_cups.next.value,
            first_of_the_three_removed_cups.next.next.value,
        ]);


        let value_of_destination_cup = this.pick_next_lower_value(this.current_cup.value);

        while (unpickable_values.has(value_of_destination_cup)) {
            value_of_destination_cup = this.pick_next_lower_value(value_of_destination_cup);
        }

        const destination_cup = this.cup_with_value.get(value_of_destination_cup);
        if (destination_cup == null) {
            throw new Error(`Unable to get destination cup with value ${value_of_destination_cup}.`);
        }
        return destination_cup;
    }

    select_next_current_cup(): void
    {
        this.current_cup = this.current_cup.next;
    }

    play_steps(number_of_steps: number)
    {
        for (let step_number = 0; step_number < number_of_steps; ++step_number) {
            const removed_cups = this.remove_three_cups_clockwise_of(this.current_cup);

            const destination_cup = this.determine_destination_cup(removed_cups);

            this.insert_three_cups_clockwise_of(destination_cup, removed_cups);

            this.select_next_current_cup();
        }
    }

    cup_order(): string
    {
        let cup = this.cup_with_value.get(1)!;
        let order_string = "";
        for (let i = 1; i < this.cup_with_value.size; ++i) {
            cup = cup.next;
            order_string += cup.value;
        }
        return order_string;
    }

    two_cups_clockwise_of_one(): [number, number]
    {
        const cup_one = this.cup_with_value.get(1)!;
        return [cup_one.next.value, cup_one.next.next.value];
    }

}



if (require.main === module) {
    const input_part1 = [5,8,3,9,7,6,2,4,1];
    const game_part1 = new CupGame(input_part1);
    game_part1.play_steps(100);
    console.log("Problem 1: ", game_part1.cup_order());

    const input_part2 = (function() {
        const input = [...input_part1];
        const highest_value = Math.max(...input);
        input.push(highest_value + 1);
        while (input[input.length - 1] != 1000000) {
            input.push(input[input.length - 1] + 1);
        }
        return input;
    })();
    const game_part2 = new CupGame(input_part2);
    game_part2.play_steps(10000000);
    const [cup1, cup2] = game_part2.two_cups_clockwise_of_one();
    console.log("Porblem 2: ", cup1 * cup2);
}