import { isEqual } from "./set_utils";


export function isPermutationOf<T>(a: Iterable<T>, b: Iterable<T>): boolean {
    const a_as_list = [...a];
    const b_as_list = [...b];
    if (a_as_list.length != b_as_list.length) {
        return false;
    }
    else {
        return isEqual(new Set(a_as_list), new Set(b_as_list));
    }
}