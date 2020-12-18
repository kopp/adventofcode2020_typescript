import { read_file_of_strings } from "./read_file_utils";


type Token = string;
type StreamOfTokens = Array<Token>;


function is_number(token: Token): boolean
{
    const match = token.match(/^(\d+)$/);
    return match != null;
}


// Note: the first part of the problem can be solved without AST -- see git history.

enum AstNodeKind
{
    invalid,
    number,
    addition,
    multiplication,
}

abstract class AstNode
{
    kind: AstNodeKind = AstNodeKind.invalid;

    abstract evaluate(): number;
}

class InvalidNode extends AstNode
{
    constructor()
    {
        super();
        this.kind = AstNodeKind.invalid;
    }

    evaluate(): number
    {
        throw new Error("Invalid node evaluated.");
    }
}

class AstOperation extends AstNode
{
    a: AstNode;
    b: AstNode;
    constructor(kind: AstNodeKind, a: AstNode, b: AstNode) {
        super();
        this.kind = kind;
        this.a = a;
        this.b = b;
    }

    static make_addition(a: AstNode, b: AstNode): AstOperation {
        return new AstOperation(AstNodeKind.addition, a, b);
    }

    static make_multiplication(a: AstNode, b: AstNode): AstOperation {
        return new AstOperation(AstNodeKind.multiplication, a, b);
    }

    evaluate(): number
    {
        const value_a = this.a.evaluate();
        const value_b = this.b.evaluate();
        switch (this.kind) {
            case AstNodeKind.multiplication:
                return value_a * value_b;
            case AstNodeKind.addition:
                return value_a + value_b;
            default:
                throw new Error(`Unknown node kind ${this.kind} -- no known operation.`);
        }
    }
}

class AstNumber extends AstNode
{
    value: number;

    constructor(value: number)
    {
        super();
        this.value = value;
        this.kind = AstNodeKind.number;
    }

    evaluate(): number
    {
        return this.value;
    }
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


/*
Build up an AST and evaluate it.

Without operator precedence, just add the next operation "on top" of the
current operation (i.e. make it the new root and have it use the old root as
one of the members).
In case of operator precedence, replace a member of the previously added node
with the new node, since nodes deeper in the AST are evaluated first (as it
should be with higher precedence).

E.g.
1 * 2 + 3 * 4
parses is processed as follows (`^` indicates the reading position when the
graph is modified, the AST is given in lisp syntax)

1 * 2 + 3 * 4
^
(1)

1 * 2 + 3 * 4
    ^
(* 1 2)

1 * 2 + 3 * 4
        ^
(* 1 (+ 2 3))
--> replace the 2 in the (* 1 2) with the new node (+ 2 3)

1 * 2 + 3 * 4
            ^
(* (* 1 (+ 2 3)) 4)

*/
function evaluate_tokens(tokens: StreamOfTokens, plus_has_precedence: boolean): number {
    if (tokens.length <= 0) {
        throw new Error(`Unable to evaluate token steam of length ${tokens.length}.`);
    }

    let root = new InvalidNode();
    let node_of_previous_operation: AstOperation | null = null;
    let index_of_next_token_to_parse: number = 0;

    // we expect some tuples of operator and number|(...)
    // for the very first iteration, we do not expect an operator
    let is_first_subexpression = true;
    while (index_of_next_token_to_parse < tokens.length) {
        // operator
        let operation: AstNodeKind;
        if (is_first_subexpression) {
            is_first_subexpression = false;
            operation = AstNodeKind.number;
        }
        else {
            const operator_token = tokens[index_of_next_token_to_parse];
            if (operator_token === "*") {
                operation = AstNodeKind.multiplication;
            }
            else if (operator_token === "+") {
                operation = AstNodeKind.addition;
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
            next_value = evaluate_tokens(sub_expression, plus_has_precedence);
            index_of_next_token_to_parse = index_closing_paren + 1;
        }
        else {
            throw new Error(`Expected number or "(" as first part of an expression, not ${tokens[0]}.`);
        }
        const next_number = new AstNumber(next_value);

        if (operation === AstNodeKind.number) {
            root = next_number;
        }
        else {
            if (operation === AstNodeKind.addition) {
                if (plus_has_precedence && (node_of_previous_operation != null)) {
                    const new_operation = AstOperation.make_addition(node_of_previous_operation.b, next_number);
                    node_of_previous_operation.b = new_operation;
                    node_of_previous_operation = new_operation;
                }
                else {
                    const new_operation = AstOperation.make_addition(root, next_number);
                    root = new_operation;
                    node_of_previous_operation = new_operation;
                }
            }
            else if (operation === AstNodeKind.multiplication) {
                const new_operation = AstOperation.make_multiplication(root, next_number);
                root = new_operation;
                node_of_previous_operation = new_operation;
            }
        }
    }

    return root.evaluate();
}

export function evaluate_without_precedence(expression: string): number {
    return evaluate_tokens(tokenize(expression), false);
}

export function evaluate_with_plus_precedence(expression: string): number {
    return evaluate_tokens(tokenize(expression), true);
}


if (require.main === module) {
    const input = read_file_of_strings("input/day18");

    {
        let sum = 0;
        for (const line of input) {
            sum += evaluate_without_precedence(line);
        }
        console.log("Problem 1: ", sum);
    }

    {
        let sum = 0;
        for (const line of input) {
            sum += evaluate_with_plus_precedence(line);
        }
        console.log("Problem 2: ", sum);
    }

}