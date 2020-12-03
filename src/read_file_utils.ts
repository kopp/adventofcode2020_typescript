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

