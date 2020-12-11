import { timeStamp } from "console";
import { read_file_of_strings } from "./read_file_utils";


enum PlaceKind
{
    Floor,
    Seat,
};


interface Place
{
    kind: PlaceKind;
};

class Floor implements Place
{
    kind: PlaceKind = PlaceKind.Floor;
};

// Strategy pattern for problem description
interface ProblemDescription {
    minRelevantSeatsOccupiedToClearSeat: number;
    findRelevantSeatsForSeatAt(pos: {row: number, column: number}, room: Room): Array<Seat>;
}

export class Part1 implements ProblemDescription {
    minRelevantSeatsOccupiedToClearSeat: number = 4;
    findRelevantSeatsForSeatAt(pos: {row: number, column: number}, room: Room): Array<Seat>
    {
        let relevant_others: Array<Seat> = [];
        for (let deltas of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
            const neighbour_row = pos.row + deltas[0];
            const neighbour_col = pos.column + deltas[1];
            if (room.is_in_room(neighbour_row, neighbour_col)) {
                let neighbour_place = room.place_at(neighbour_row, neighbour_col);
                if (neighbour_place.kind == PlaceKind.Seat) {
                    relevant_others.push(neighbour_place as Seat);
                }
            }

        }
        return relevant_others;
    }
}

export class Part2 implements ProblemDescription {
    minRelevantSeatsOccupiedToClearSeat: number = 5;
    findRelevantSeatsForSeatAt(pos: {row: number, column: number}, room: Room): Array<Seat>
    {
        let relevant_others: Array<Seat> = [];
        for (let direction of [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]) {
            for (let n: number = 1; n < Math.max(room.columns, room.rows); ++n) {
                const row = pos.row + n * direction[0];
                const col = pos.column + n * direction[1];
                const end_of_room_reached = ! room.is_in_room(row, col);
                if (end_of_room_reached) {
                    break;
                }
                else {
                    let place = room.place_at(row, col);
                    if (place.kind == PlaceKind.Floor) {
                        continue; // continue in this direction (look over floor)
                    }
                    else if (place.kind == PlaceKind.Seat) {
                        relevant_others.push(place as Seat);
                        break; // done in this direction
                    }
                    else {
                        throw new Error(`Unknown kind of place at ${row}, ${col}`);
                    }

                }

            }
        }
        return relevant_others;
    }
}

export class Seat implements Place
{
    kind: PlaceKind = PlaceKind.Seat;

    relevant_others: Array<Seat> = [];
    is_currently_occupied: boolean = false;
    is_occupied_after_update: boolean | null = null;
    row: number = -1; // used for debugging only
    column: number = -1 // used for debugging only

    constructor(public problemDescription: ProblemDescription) {
    }

    compute_next_occupation(): void
    {
        const number_of_occupied_neighbours = this.relevant_others.reduce(
            (num_occ: number, seat: Seat) => num_occ += seat.is_currently_occupied ? 1 : 0,
            0);
        if (this.is_currently_occupied && (number_of_occupied_neighbours >= this.problemDescription.minRelevantSeatsOccupiedToClearSeat)) {
            this.is_occupied_after_update = false;
        }
        else if (! this.is_currently_occupied && (number_of_occupied_neighbours == 0)) {
            this.is_occupied_after_update = true;
        }
        else {
            this.is_occupied_after_update = this.is_currently_occupied;
        }
    }

    /**
     * @returns If the occupation changed in the update.
     */
    update_occupation(): boolean
    {
        if (this.is_occupied_after_update == null) {
            throw new Error("Please call compute_next_occupation before update_occupation.");
        }
        // console.log(`Updating Seat at ${this.row}, ${this.column} from ${this.is_currently_occupied} to ${this.is_occupied_after_update}.`)
        const change = this.is_currently_occupied != this.is_occupied_after_update;
        this.is_currently_occupied = this.is_occupied_after_update;
        this.is_occupied_after_update = null;
        return change;
    }

};

export class Room
{
    seats: Array<Seat> = [];
    places: Array<Place> = [];
    rows: number;
    columns: number;
    problemDescription: ProblemDescription;

    constructor(layout: Array<string>, problemDescription: ProblemDescription = new Part1())
    {
        this.columns = layout[0].length;
        this.rows = layout.length;

        this.problemDescription = problemDescription;

        for (const row of layout) {
            for (const place_character of row) {
                if (place_character === "L") {
                    let seat = new Seat(this.problemDescription);
                    this.seats.push(seat);
                    this.places.push(seat);
                }
                else if (place_character === ".") {
                    let floor = new Floor();
                    this.places.push(floor);
                }
                else {
                    throw new Error(`Unable to parse ${place_character} in ${row}.`);
                }
            }
        }

        for (let row_index = 0; row_index < this.rows; ++row_index) {
            for (let col_index = 0; col_index < this.columns; ++col_index) {
                let place = this.place_at(row_index, col_index);
                if (place.kind == PlaceKind.Seat) {
                    let seat = place as Seat;
                    seat.row = row_index;
                    seat.column = col_index;
                    seat.relevant_others = problemDescription.findRelevantSeatsForSeatAt({row: row_index, column: col_index}, this);
                }
            }
        }
    }

    dump(): string[]
    {
        let output: string[] = [];
        for (let row_index = 0; row_index < this.rows; ++row_index) {
            let row: string = "";
            for (let col_index = 0; col_index < this.columns; ++col_index) {
                const place = this.place_at(row_index, col_index);
                if (place.kind == PlaceKind.Floor) {
                    row += ".";
                }
                else if (place.kind == PlaceKind.Seat) {
                    let seat = place as Seat;
                    if (seat.is_currently_occupied) {
                        row += "#";
                    }
                    else {
                        row += "L";
                    }
                }
                else {
                    throw new Error(`Unknown place kind ${place.kind}.`);
                }
            }
            output.push(row);
        }
        return output;
    }

    /** Return whether something changed. */
    update(): boolean
    {
        this.seats.forEach(seat => seat.compute_next_occupation());
        let change = false;
        this.seats.forEach(seat => {
            const seat_changed = seat.update_occupation();
            change = change || seat_changed;
        });
        return change;
    }

    number_of_occupied_seats(): number
    {
        const num_occupied = this.seats.reduce(
            (num_occ: number, seat: Seat) => num_occ += seat.is_currently_occupied ? 1 : 0,
            0
        );
        return num_occupied;
    }

    is_in_room(row: number, column: number): boolean
    {
        return (
            (row >= 0) && (row < this.rows) &&
            (column >= 0) && (column < this.columns)
        );
    }

    place_at(row: number, column: number): Place
    {
        if (row > this.rows) {
            throw new Error(`Row ${row} exceeds available rows ${this.rows}.`);
        }
        if (column > this.columns) {
            throw new Error(`Column ${column} exceeds available columns ${this.columns}.`);
        }
        const index = column + row * this.columns;
        return this.places[index];
    }

};


function update_until_no_futher_changes(room: Room): void
{
    var changed = true;
    while (changed) {
        changed = room.update();
        // console.log(room.number_of_occupied_seats());
    }
}



if (require.main === module) {
    let input = read_file_of_strings("input/day11");

    {
        let room = new Room(input);
        update_until_no_futher_changes(room);
        console.log("Problem 1: ", room.number_of_occupied_seats());
    }
    {
        let room = new Room(input, new Part2());
        update_until_no_futher_changes(room);
        console.log("Problem 2: ", room.number_of_occupied_seats());
    }
}