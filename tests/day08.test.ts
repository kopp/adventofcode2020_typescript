import {
    Bootloader,
    Instruction,
    TerminationCause,
    parse_instruction,
    fix_code_to_allow_termination,
} from "../src/day08";

test("parse instructions", () => {
    expect(parse_instruction("acc +1")).toEqual([Instruction.acc, 1]);
    expect(parse_instruction("acc -1")).toEqual([Instruction.acc, -1]);
    expect(parse_instruction("jmp -10000")).toEqual([Instruction.jmp, -10000]);
    expect(parse_instruction("nop +0")).toEqual([Instruction.nop, 0]);
});

let program = [
    "nop +0",
    "acc +1",
    "jmp +4",
    "acc +3",
    "jmp -3",
    "acc -99",
    "acc +1",
    "jmp -4",
    "acc +6",
];

test("Bootloader", () => {
    let bootloader = new Bootloader(program);
    expect(bootloader.accumulator).toEqual(0);
    expect(bootloader.instruction_counter).toEqual(0);

    bootloader.execute_instruction_at(0);
    expect(bootloader.accumulator).toEqual(0);
    expect(bootloader.instruction_counter).toEqual(1);

    bootloader.execute_instruction_at(1);
    expect(bootloader.accumulator).toEqual(1);
    expect(bootloader.instruction_counter).toEqual(2);

    bootloader.execute_instruction_at(2);
    expect(bootloader.accumulator).toEqual(1);
    expect(bootloader.instruction_counter).toEqual(6);
});

test("Bootloader in infinite loop", () => {
    let bootloader = new Bootloader(program);
    expect(bootloader.run()).toEqual([TerminationCause.InfiniteLoop, 5]);
});

test ("fix code", () => {
    expect(fix_code_to_allow_termination(program)).toEqual(8);
});