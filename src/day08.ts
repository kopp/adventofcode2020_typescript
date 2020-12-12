import { read_file_of_strings } from "./read_file_utils";


export enum Instruction {
    acc,
    jmp,
    nop,
}

export enum TerminationCause {
    SingleStepDone,
    InfiniteLoop,
    EndOfCodeReached,
    OutsideOfCodeReached,
}

export function parse_instruction(instruction: string): [Instruction, number]
{
    function parse_argument(instruction: string) : number
    {
        const match = instruction.match(/^([^ ]+) ([-+]\d+)$/);
        if (match == null) {
            throw new Error(`Unable to parse argument from ${instruction}.`);
        }
        else {
            return parseInt(match[2]);
        }
    }
    if (instruction.startsWith("jmp")) {
        return [Instruction.jmp, parse_argument(instruction)];
    }
    else if (instruction.startsWith("acc")) {
        return [Instruction.acc, parse_argument(instruction)];
    }
    else if (instruction.startsWith("nop")) {
        return [Instruction.nop, parse_argument(instruction)];
    }
    else {
        throw new Error(`Unable to parse instruction ${instruction}.`);
    }
}

export class Bootloader
{
    code: Array<string>;
    accumulator: number = 0;
    instruction_counter: number = 0;
    executed_instructions: Set<number> = new Set();

    constructor(code: Array<string>)
    {
        this.code = code;
    }

    execute_instruction_at(index: number): void
    {
        const [instruction, argument] = parse_instruction(this.code[index]);
        switch (instruction) {
            case Instruction.acc:
                this.accumulator += argument!;
                this.instruction_counter += 1;
                break;
            case Instruction.nop:
                this.instruction_counter += 1;
                break;
            case Instruction.jmp:
                this.instruction_counter += argument!;
                break;
            default:
                throw new Error(`Unable to handle instruction ${instruction}`);
        }
    }

    run(): [TerminationCause, number]
    {
        let termination_due_to = TerminationCause.SingleStepDone;
        while (termination_due_to == TerminationCause.SingleStepDone) {
            termination_due_to = this.run_one_instruction();
        }
        return [termination_due_to, this.accumulator];
    }

    peek_next_instruction(): Instruction
    {
        const [instruction] = parse_instruction(this.code[this.instruction_counter])
        return instruction;
    }

    is_next_instruction_toggleable(): boolean
    {
        const instr = this.peek_next_instruction();
        return (instr == Instruction.nop) || (instr == Instruction.jmp);
    }

    /**
     * Toggle next instruction between jmp and nop (does not affect the
     * argument).
     * Return index of the toggeled instruction.
     */
    toggle_next_instruction(): number
    {
        const index_toggled = this.instruction_counter;
        switch (this.peek_next_instruction())
        {
            case Instruction.jmp:
                this.code[index_toggled] = this.code[index_toggled].replace("jmp", "nop");
                break;
            case Instruction.nop:
                this.code[index_toggled] = this.code[index_toggled].replace("nop", "jmp");
                break;
            default:
                throw new Error("Unable to toggle instruction");
        }
        return index_toggled;
    }

    run_one_instruction(): TerminationCause
    {
        const instruction_no = this.instruction_counter;
        if (this.executed_instructions.has(instruction_no)) {
            return TerminationCause.InfiniteLoop;
        }

        this.executed_instructions.add(instruction_no);
        this.execute_instruction_at(instruction_no);

        if (this.instruction_counter == this.code.length) {
            return TerminationCause.EndOfCodeReached;
        }
        else if ((this.instruction_counter > this.code.length) || (this.instruction_counter < 0)) {
            return TerminationCause.OutsideOfCodeReached;
        }

        return TerminationCause.SingleStepDone;
    }

    clone(): Bootloader
    {
        let clone = new Bootloader(this.code);
        clone.accumulator = this.accumulator;
        clone.instruction_counter = this.instruction_counter;
        clone.executed_instructions = new Set([...this.executed_instructions]);
        return clone;
    }

    restore_from_backup(backup: Bootloader): void
    {
        if (this.code != backup.code) {
            throw new Error("Unable to restore backup");
        }
        this.accumulator = backup.accumulator;
        this.instruction_counter = backup.instruction_counter;
        this.executed_instructions = new Set([...backup.executed_instructions]);
    }
}


export function fix_code_to_allow_termination(code: Array<string>): number
{
    let instructions_already_toggled: Set<number> = new Set();
    let bootloader = new Bootloader(code);

    while (true) {
        if (
            (bootloader.is_next_instruction_toggleable())
            &&
            (!instructions_already_toggled.has(bootloader.instruction_counter))
        ) {
            let clone = bootloader.clone();
            const toggled_at = clone.toggle_next_instruction();
            instructions_already_toggled.add(toggled_at);
            let [cause, accumulator] = clone.run();
            if (cause == TerminationCause.EndOfCodeReached) {
                return accumulator;
            }
            else {
                // clone and original share the code, so make sure to toggle that back
                bootloader.toggle_next_instruction();
            }
        }
        else {
            let termination = bootloader.run_one_instruction();
            if (termination == TerminationCause.EndOfCodeReached) {
                return bootloader.accumulator;
            }
        }

    }
}


if (require.main === module) {
    const input = read_file_of_strings("input/day08");

    let part1_bootloader = new Bootloader(input);
    let part1_solution = part1_bootloader.run();
    console.log("Part 1: ", part1_solution[1]);

    console.log("Part 2: ", fix_code_to_allow_termination(input));
}