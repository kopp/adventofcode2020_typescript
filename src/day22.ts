import { read_file_of_strings } from "./read_file_utils";


export class Game
{
    cards_player1: Array<number>;
    cards_player2: Array<number>;

    is_with_recursion: boolean;
    happened_before: boolean = false;

    private player1_history: Set<string>;
    winner: number = 0;  // 1,2: player, 0: unknown

    constructor(cards_player1: Array<number>, cards_player2: Array<number>, is_with_recursion: boolean)
    {
        this.is_with_recursion = is_with_recursion;
        this.cards_player1 = cards_player1;
        this.cards_player2 = cards_player2;
        this.player1_history = new Set();
    }

    /**
     * @returns true if the current situation has happened before
     */
    private store_player1_state_and_check_whether_it_happened_before(): boolean
    {
        const player1_state_as_string = this.cards_player1.join(",");
        if (this.player1_history.has(player1_state_as_string)) {
            return true;
        }
        else {
            this.player1_history.add(player1_state_as_string);
            return false;
        }
    }

    /**
     * Play the game until there is a winner, sets `winner` to the winner.
     * @return true if player 1 won, false if player 2 won.
     */
    play_game(): boolean
    {
        while (! this.is_finished())
        {
            this.play_one_round();
        }

        return this.determine_winner();
    }

    determine_winner(): boolean
    {
        if (this.happened_before) {
            this.winner = 1;
            return true;
        }
        else {
            if (this.cards_player1.length === 0) {
                this.winner = 2;
                return false;
            }
            else if (this.cards_player2.length === 0) {
                this.winner = 1;
                return true;
            }
            else {
                this.winner = 0;
                throw new Error("Unable to determine winner.");
            }
        }

    }

    play_one_round(): void
    {
        if (this.is_with_recursion) {
            this.happened_before = this.store_player1_state_and_check_whether_it_happened_before();
            if (this.happened_before)
            {
                return;
            }
        }

        const value1 = this.cards_player1.shift();
        const value2 = this.cards_player2.shift();

        if ((value1 == null) || (value2 == null)) {
            throw new Error("Unable to play a round as one player does not have any more cards.");
        }

        let player1_wins_round: boolean;

        if (this.is_with_recursion && (this.cards_player1.length >= value1) && (this.cards_player2.length >= value2)) {
            player1_wins_round = this.play_recursive_game(value1, value2);
        }
        else {
            player1_wins_round = value1 > value2;
        }

        if (player1_wins_round) {
            this.cards_player1.push(value1);
            this.cards_player1.push(value2);
        }
        else {
            this.cards_player2.push(value2);
            this.cards_player2.push(value1);
        }
    }

    /**
     * @returns true if player 1 wins, false if player 2 wins
     */
    play_recursive_game(value1: number, value2: number): boolean
    {
        const sub_game = new Game(
            [...this.cards_player1.slice(0, value1)],
            [...this.cards_player2.slice(0, value2)],
            this.is_with_recursion
        );
        return sub_game.play_game();
    }

    is_finished(): boolean {
        if (this.is_with_recursion && this.happened_before) {
            return true;
        }

        const is_game_finished = ((this.cards_player1.length === 0) || (this.cards_player2.length === 0));
        return is_game_finished;
    }

    winning_score(): number
    {
        if (! this.is_finished()) {
            throw new Error("Looks like no one won (yet).");
        }

        let winning_cards: Array<number>;
        this.determine_winner();
        if (this.winner == 2) {
            winning_cards = this.cards_player2;
        }
        else {
            winning_cards = this.cards_player1;
        }

        let score = 0;
        for (let index = 0; index < winning_cards.length; ++index) {
            const multiplicator = winning_cards.length - index;
            score += multiplicator * winning_cards[index];
        }
        return score;
    }
}


function make_game_from_description(description: Array<string>, recursive_game: boolean): Game
{
    const cards = [new Array<number>(), new Array<number>()];
    let player = -1;
    for (const line of description) {
        if (line === "Player 1:") {
            player = 0;
            continue;
        }
        else if (line === "Player 2:") {
            player = 1;
            continue;
        }
        else if (line.length === 0) {
            continue;
        }
        else {
            const value = parseInt(line);
            cards[player].push(value);
        }
    }

    const game = new Game(cards[0], cards[1], recursive_game);
    return game;
}


if (require.main === module) {
    const input = read_file_of_strings("input/day22");

    const normal_game = make_game_from_description(input, false);
    normal_game.play_game();
    console.log("Problem 1: ", normal_game.winning_score());

    const recursive_game = make_game_from_description(input, true);
    recursive_game.play_game();
    console.log("Problem 2: ", recursive_game.winning_score());
}