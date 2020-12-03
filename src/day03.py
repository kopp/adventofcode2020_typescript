

test_input = [
        "..##.......",
        "#...#...#..",
        ".#....#..#.",
        "..#.#...#.#",
        ".#...##..#.",
        "..#.##.....",
        ".#.#.#....#",
        ".#........#",
        "#.##...#...",
        "#...##....#",
        ".#..#...#.#",
        ]


col = 0
number_hits = 0
for row in test_input:
    if row[col] == "#":
        number_hits += 1
    col += 3
    col = col % len(row)

assert number_hits == 7


col = 0
number_hits = 0
with open("input/day03", "r") as true_input:
    for row in true_input:
        row = row.strip()
        if row[col] == "#":
            number_hits += 1
        col += 3
        col = col % len(row)

print(number_hits)
