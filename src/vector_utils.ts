
export interface Vector2d
{
    x: number;
    y: number;
}


/**
 * return base + scalar * direction
 */
export function linearcombination(base: Vector2d, scalar: number, direction: Vector2d): Vector2d
{
    const result = { x: base.x + scalar * direction.x, y: base.y + scalar * direction.y };
    return result;
}


export function manhattan_distance(a: Vector2d, b: Vector2d): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}


export function manhattan_length(a: Vector2d): number {
    return Math.abs(a.x) + Math.abs(a.y);
}

