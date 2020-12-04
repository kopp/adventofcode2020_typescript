import re


KEY_VALUE_PAIR_RE = re.compile(r"([a-z]+):([^ ]+)")


example = """ecl:gry pid:860033327 eyr:2020 hcl:#fffffd
byr:1937 iyr:2017 cid:147 hgt:183cm

iyr:2013 ecl:amb cid:350 eyr:2023 pid:028048884
hcl:#cfa07d byr:1929

hcl:#ae17e1 iyr:2013
eyr:2024
ecl:brn pid:760753108 byr:1931
hgt:179cm

hcl:#cfa07d eyr:2025 pid:166559648
iyr:2011 ecl:brn hgt:59in
"""


NECESSARY_KEYS = set([
    "byr",
    "iyr",
    "eyr",
    "hgt",
    "hcl",
    "ecl",
    "pid",
    ])


found_keys = set()
num_valid_passports = 0

# NOTE: Input has to have a blank line at the end for this to work!

input_file = open("input/day04", "r")
# for line in example.split("\n"):
for line in input_file:
    print("line: ", line)
    if len(line.strip()) == 0:
        valid = NECESSARY_KEYS.issubset(found_keys)
        if valid:
            num_valid_passports += 1
        else:
            missing = NECESSARY_KEYS.difference(found_keys)
            print("invalid; missing: ", missing)
        found_keys = set()
    else:
        for key_value_pair in line.split(" "):
            print("pair: ", key_value_pair)
            match = KEY_VALUE_PAIR_RE.match(key_value_pair)
            key, value = match.groups()
            found_keys.add(key)

print("Number Valid: ", num_valid_passports)
