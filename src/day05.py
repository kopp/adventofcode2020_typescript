

with open("input/day05", "r") as data:
    seat_ids = []
    for line in data:
        line = line.strip()
        line = line.replace("B", "1")
        line = line.replace("F", "0")
        line = line.replace("R", "1")
        line = line.replace("L", "0")
        seat_id = int(line, base=2)
        seat_ids.append(seat_id)
    print("Part 1: ", max(seat_ids))
    seat_ids = sorted(seat_ids)
    previous_id = None
    for seat_id in seat_ids:
        if previous_id is None:
            previous_id = seat_id
            continue
        if seat_id != previous_id + 1:
            gap = seat_id - 1
            print("Part 2: ", gap)
        previous_id = seat_id
