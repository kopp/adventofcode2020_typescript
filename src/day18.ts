import { Stream } from "stream";
import { read_file_of_strings } from "./read_file_utils";


type Token = string;
type StreamOfTokens = Array<Token>;


function is_number(token: Token): boolean
{
    const match = token.match(/^(\d+)$/);
    return match != null;
}


export function tokenize(expression: string): StreamOfTokens
{
    const words_to_parse = expression.trim().split(" ");
    let tokens = new Array<Token>();
    for (const word of words_to_parse) {

        let first_non_paren_index = 0;
        for (let i = 0; i < word.length; ++i) {
            if (word[i] === "(") {
                first_non_paren_index = i + 1;
            }
            else {
                break;
            }
        }

        let last_non_paren_index = word.length - 1;
        for (let i = word.length - 1; i >= 0; --i) {
            if (word[i] === ")") {
                last_non_paren_index = i - 1;
            }
            else {
                break;
            }
        }

        const number_of_opening_parens = first_non_paren_index;
        const number_of_closing_parens = word.length - 1 - last_non_paren_index;
        const non_paren_substring = word.substring(first_non_paren_index, last_non_paren_index + 1);

        for (let i = 0; i < number_of_opening_parens; ++i) {
            tokens.push("(");
        }
        tokens.push(non_paren_substring);
        for (let i = 0; i < number_of_closing_parens; ++i) {
            tokens.push(")");
        }
    }
    return tokens;
}


function index_of_matching_closing_parenthesis(tokens: StreamOfTokens, index_of_opening_parenthesis: number)
{
    let open_parentheses = 0;
    for (let index = index_of_opening_parenthesis; index < tokens.length; ++index) {
        if (tokens[index] === "(") {
            open_parentheses += 1;
        }
        if (tokens[index] === ")") {
            open_parentheses -= 1;
            if (open_parentheses == 0) {
                return index;
            }
        }
    }
    throw new Error(`Unable to find ")" in ${tokens} for "(" at index ${index_of_opening_parenthesis}).`);
}


function evaluate_tokens(tokens: StreamOfTokens): number {
    if (tokens.length <= 0) {
        throw new Error(`Unable to evaluate token steam of length ${tokens.length}.`);
    }

    let current_value: number = NaN;  // should get overwritten in the first subexpression.
    let index_of_next_token_to_parse: number = 0;

    // we expect some tuples of operator and number|(...)
    // for the very first iteration, we do not expect an operator
    let is_first_subexpression = true;
    while (index_of_next_token_to_parse < tokens.length) {
        // operator
        let operation: (next_value: number) => number;
        if (is_first_subexpression) {
            operation = (next_value: number) => next_value;
            is_first_subexpression = false;
        }
        else {
            const operator_token = tokens[index_of_next_token_to_parse];
            if (operator_token === "*") {
                operation = (next_value: number) => current_value * next_value;
            }
            else if (operator_token === "+") {
                operation = (next_value: number) => current_value + next_value;
            }
            else {
                throw new Error(`Expected operator (+ or *) but got ${operator_token}.`);
            }
            index_of_next_token_to_parse += 1;
        }

        // value
        let next_value: number;
        if (is_number(tokens[index_of_next_token_to_parse])) {
            next_value = parseInt(tokens[index_of_next_token_to_parse]);
            index_of_next_token_to_parse += 1;
        }
        else if (tokens[index_of_next_token_to_parse] === "(") {
            const index_closing_paren = index_of_matching_closing_parenthesis(tokens, index_of_next_token_to_parse);
            const sub_expression = tokens.slice(index_of_next_token_to_parse + 1, index_closing_paren);
            next_value = evaluate_tokens(sub_expression);
            index_of_next_token_to_parse = index_closing_paren + 1;
        }
        else {
            throw new Error(`Expected number or "(" as first part of an expression, not ${tokens[0]}.`);
        }

        current_value = operation(next_value);
    }


    return current_value;
}

export function evaluate(expression: string): number {
    return evaluate_tokens(tokenize(expression));
}


if (require.main === module) {
    const input = read_file_of_strings("input/day18");

    let sum = 0;
    for (const line of input) {
        sum += evaluate(line);
    }
    console.log("Problem 1: ", sum);

}