import { read_file_of_strings } from "./read_file_utils";


// A rule is expected to consist of tokens like "<23>" which indicate rule 23 or
// literals like "a" or possible matches like "(<23>|<47>)" etc.
// Each value in <> is the index of a rule that is to be expanded.
type Rules = Map<number, string>;

function tokenize_rule(rule: string): string {
    if (rule.startsWith("\"")) {
        return rule[1]; // assume "a" or "b" (not "ab")
    }
    else {
        let tokenized = rule
            .trim()
            .replace(/ \| /g, ">|<")
            .replace(/ /g, "><")
            ;
        tokenized = "<" + tokenized + ">";
        if (tokenized.includes("|")) {
            tokenized = "(" + tokenized + ")";
        }
        return tokenized;
    }
}


export function build_regexp_from(rules: Rules, include_part2_fixes: boolean = false): RegExp
{
    function get_rule_no(index: number): string
    {
        const rule = rules.get(index);
        if (rule == undefined) {
            throw new Error(`Unable to get rule no ${index}.`);
        }
        return rule;
    }

    function replace_rule_token(token: string): string
    {
        if ((token[0] != "<") || (token[token.length-1] != ">")) {
            throw new Error(`Expected tokens to be in <> braces, not ${token}.`);
        }
        const index = parseInt(token.slice(1, token.length));
        if (include_part2_fixes)
        {
            if (index == 8) {
                // <42> once or multiple times
                return "(<42>)+";
            }
            else if (index == 11) {
                // n times <42> followed by n times <31>
                // n = 1, 2, .... -- here, bounded by some lucky guess value
                let possibilities = "((<42><31>)";
                for (let repetitions = 1; repetitions < 10; ++repetitions) {
                    possibilities += `|((<42>){${repetitions}}(<31>){${repetitions}})`;
                }
                possibilities += ")";
                return possibilities;
            }
        }
        return get_rule_no(index);
    }

    let regex = get_rule_no(0);
    while (regex.includes("<")) {
        regex = regex.replace(/<(\d+)>/, replace_rule_token);
    }

    return new RegExp("^" + regex + "$");
}




export function parse_input(input: Array<string>): [Rules, Array<string>]
{
    let rules = new Map<number, string>();
    let to_test = new Array<string>();

    let is_rules = true;
    for (const line of input) {
        if (is_rules) {
            const match = line.match(/^(\d+): (.+)$/);
            if (match == null) {
                is_rules = false;
            }
            else {
                const index = parseInt(match[1]);
                const rule_string = match[2];
                const rule = tokenize_rule(rule_string);
                rules.set(index, rule);
            }
        }

        // do not use else -- is_rules can change above!
        if (! is_rules) {
            to_test.push(line);
        }
    }

    return [rules, to_test];
}


export function count_matches_in(input: Array<string>, include_part2_fixes: boolean = false): number
{
    const [rules, strings_to_test] = parse_input(input);
    const regexp = build_regexp_from(rules, include_part2_fixes);

    let number_of_matches = 0;
    for (const to_test of strings_to_test) {
        const match = to_test.match(regexp);
        if (match != null) {
            number_of_matches += 1;
        }
    }

    return number_of_matches;
}



if (require.main === module) {
    const input = read_file_of_strings("input/day19");

    const number_of_matches = count_matches_in(input);
    console.log("Problem 1: ", number_of_matches);

    const number_of_matches_pt2 = count_matches_in(input, true);
    console.log("Problem 2: ", number_of_matches_pt2);
}