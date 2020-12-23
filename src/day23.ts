

export class CupGame
{
    cups: Array<number>;
    index_current_cup: number = 0;

    constructor(cups: Array<number>)
    {
        this.cups = [...cups];
    }

    remove_three_cups_clockwise_of(index: number): Array<number>
    {
        const first_index_to_remove = (index + 1) % this.cups.length;
        const last_index_to_remove = (index + 3) % this.cups.length;

        if (first_index_to_remove < last_index_to_remove) {
            const cups = this.cups.slice(first_index_to_remove, last_index_to_remove + 1);
            this.cups = [...this.cups.slice(0, first_index_to_remove), ...this.cups.slice(last_index_to_remove + 1, this.cups.length)];
            return cups;
        }
        else {
            const cups = this.cups.slice(first_index_to_remove, this.cups.length);
            this.cups = [...this.cups.slice(0, first_index_to_remove)];
            while (cups.length < 3) {
                cups.push(this.cups.shift()!);
            }
            return cups;
        }
    }

    insert_three_cups_clockwise_of(index: number, cups: Array<number>): void
    {
        if (cups.length !== 3) {
            throw new Error(`Expected 3 cups, received ${cups.length}.`);
        }

        this.cups = [...this.cups.slice(0, index + 1), ...cups, ...this.cups.slice(index + 1, this.cups.length)];
    }

    determine_index_of_destination_cup(value_current_cup: number): number
    {
        let index_destination_cup = -1;
        let value_destination_cup = value_current_cup - 1;
        const min_value_in_cups = Math.min(...this.cups);
        const max_value_in_cups = Math.max(...this.cups);
        while (index_destination_cup === -1) {
            index_destination_cup = this.cups.findIndex((value) => value === value_destination_cup);
            value_destination_cup -= 1;
            if (value_destination_cup < min_value_in_cups) {
                value_destination_cup = max_value_in_cups;
            }
        }
        return index_destination_cup;
    }

    select_next_current_cup(value_current_cup: number): void
    {
        // index may have changed due to insert
        const index_current_cup = this.cups.findIndex((value) => value === value_current_cup);
        const next_index = (index_current_cup + 1) % this.cups.length;
        this.index_current_cup = next_index;
    }

    play_steps(number_of_steps: number)
    {
        for (let step_number = 0; step_number < number_of_steps; ++step_number) {
            const value_current_cup = this.cups[this.index_current_cup];

            const removed_cups = this.remove_three_cups_clockwise_of(this.index_current_cup);

            const index_destination_cup = this.determine_index_of_destination_cup(value_current_cup);

            this.insert_three_cups_clockwise_of(index_destination_cup, removed_cups);

            this.select_next_current_cup(value_current_cup);
        }
    }

    cup_order(): string
    {
        const index_of_one = this.cups.findIndex((value) => value === 1);
        let order_string = "";
        for (let i = index_of_one + 1; i < index_of_one + this.cups.length; ++i) {
            const index = i % this.cups.length;
            order_string += this.cups[index].toString();
        }
        return order_string;
    }

}



if (require.main === module) {
    const input = [5,8,3,9,7,6,2,4,1];
    const game = new CupGame(input);
    game.play_steps(100);
    console.log("Problem 1: ", game.cup_order());
}