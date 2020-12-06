

with open("input/day06", "r") as data:
    current_set = set()
    sum_of_set_sizes = 0
    for line in data:
        line = line.strip()
        if len(line) == 0:
            sum_of_set_sizes += len(current_set)
            current_set = set()
        else:
            current_set = current_set.union(set(line))

    print("Part 1: ", sum_of_set_sizes)


with open("input/day06", "r") as data:
    current_set = None
    sum_of_set_sizes = 0
    for line in data:
        line = line.strip()
        if len(line) == 0:
            sum_of_set_sizes += len(current_set)
            current_set = None
        else:
            if current_set is None:
                current_set = set(line)
            else:
                current_set = current_set.intersection(set(line))  # pt2

    print("Part 2: ", sum_of_set_sizes)
