import { reverse_string } from "../src/string_utils";


test("reverse", () => {
    expect(reverse_string("")).toEqual("");
    expect(reverse_string("a")).toEqual("a");
    expect(reverse_string("abcd")).toEqual("dcba");
    expect(reverse_string("abcd EFGH")).toEqual("HGFE dcba");
    expect(reverse_string("aba")).toEqual("aba");
})
