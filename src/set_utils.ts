// Note: union and intersection do not seem to be provided by the standard library.
//       https://2ality.com/2015/01/es6-set-operations.html

export function union<T>(a: Iterable<T>, b: Iterable<T>): Set<T> {
    return new Set([...a, ...b]);
}

export function intersect<T>(a: Iterable<T>, b: Set<T>): Set<T> {
    return new Set([...a].filter(x => b.has(x)));
}