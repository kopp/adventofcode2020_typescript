
import re

input_line_re = re.compile(r"(\d+)-(\d+) (.): (.+)")


def get_occurances(item, sequence):
    count = 0
    for element in sequence:
        if element == item:
            count += 1
    return count


with open("input/day02", "r") as inp:
    invalid_pws = []
    count_valid_pws = 0
    for line in inp:
        match = input_line_re.match(line)
        if not match:
            print(f"Unable to parse line '{line}'")
        else:
            min_occ, max_occ, char, string = match.groups()
            min_occ = int(min_occ)
            max_occ = int(max_occ)
            num_occurances = get_occurances(char, string)
            if num_occurances < min_occ or num_occurances > max_occ:
                print("invalid: {:3} {:3} {:3}".format(min_occ, num_occurances, max_occ), line.strip())
                invalid_pws.append(line)
            else:
                count_valid_pws += 1
    print("Invalid passwords: ", len(invalid_pws))
    print("Valid passwords: ", count_valid_pws)
