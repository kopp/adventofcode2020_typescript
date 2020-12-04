import { readFileSync } from 'fs';

export function read_file_of_numbers(filename: string): number[] {
    let content: string = readFileSync(filename,'utf8');
    var numbers: number[] = [];
    for (let line of content.split("\n")) {
        let integer = parseInt(line);
        if (Number.isNaN(integer)) {
            console.log("Skipping input line ", line);
        }
        else {
            numbers.push(integer);
        }
    }
    return numbers;
}

export function read_file_of_strings(filename: string): string[] {
    let content: string = readFileSync(filename,'utf8');
    var strings: string[] = [];
    for (let line of content.split("\n")) {
        if (line.length > 0) {
            strings.push(line);
        }
    }
    return strings;
}

/**
 * Content chunks are separated by empty (blank) lines.
 * The output is an array of those chunks.
 * Each chunk itself is whitespace separated tokens.
 * A chunk is represented as list of these tokens as strings.
 *
 * So a file
 * ```
 * foo bar
 * asdf
 *
 * abcd
 * def geh
 * ```
 * is interpreted as
 * ```
 * [["foo", "bar", "asdf"], ["abcd", "def", "geh"]]
 *  ^-- chunk 1 ---------^  ^-- chunk 2 ---------^
 * ```
 */
export function read_empty_line_and_whitespace_separated_strings(filename: string): Array<Array<string>> {
    var all_content: Array<Array<string>> = [];
    var current_content: Array<string> = [];

    let content: string = readFileSync(filename,'utf8');
    for (let line of content.split("\n")) {
        if (line.trim().length == 0) {
            if (current_content.length > 0) {
                all_content.push(current_content);
            }
            current_content = []
        }
        else {
            for (let a_string of line.split(/\s+/)) {
                current_content.push(a_string);
            }
        }
    }
    if (current_content.length > 0) {
        all_content.push(current_content);
    }

    return all_content;
}
