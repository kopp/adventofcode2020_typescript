import { read_file_of_strings } from "./read_file_utils";


export class Game
{
    cards_player1: Array<number>;
    cards_player2: Array<number>;

    constructor(cards_player1: Array<number>, cards_player2: Array<number>)
    {
        this.cards_player1 = cards_player1;
        this.cards_player2 = cards_player2;
    }

    /**
     * @returns true if the game is finished
     */
    play_one_round(): void
    {
        const value1 = this.cards_player1.shift();
        const value2 = this.cards_player2.shift();

        if ((value1 == null) || (value2 == null)) {
            throw new Error("Unable to play a round as one player does not have any more cards.");
        }

        const player1_wins_round = value1 > value2;
        if (player1_wins_round) {
            this.cards_player1.push(value1);
            this.cards_player1.push(value2);
        }
        else {
            this.cards_player2.push(value2);
            this.cards_player2.push(value1);
        }

    }

    is_finished(): boolean {
        const is_game_finished = ((this.cards_player1.length === 0) || (this.cards_player2.length === 0));
        return is_game_finished;
    }

    winning_score(): number
    {
        if (! this.is_finished()) {
            throw new Error("Looks like no one won (yet).");
        }

        let winning_cards: Array<number>;
        if (this.cards_player1.length === 0) {
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


function make_game_from_description(description: Array<string>): Game
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

    const game = new Game(cards[0], cards[1]);
    return game;
}


if (require.main === module) {
    const input = read_file_of_strings("input/day22");
    const game = make_game_from_description(input);

    while (! game.is_finished())
    {
        game.play_one_round();
    }
    console.log("Problem 1: ", game.winning_score());
}