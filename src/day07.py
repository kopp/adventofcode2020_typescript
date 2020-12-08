
import re
from typing import Tuple, Dict, List

re.compile(r"^(.+) bags contain (((\d+) (.+) bags?(, (\d+) (.+) bags?)?)|(no other bags)).$")
re.compile(r"^(.+) bags contain((,? (\d+) (.+) bags?)+|(no other bags)).$")

CONTAINED_BAGS = re.compile(r"^(\d+) (.+) bags?$")


class ContainedBags:
    def __init__(self, count: int, color: str):
        self.count = count
        self.color = color


bags_containing = {}
bag_contents: Dict[str, List[ContainedBags]] = {}

with open("input/day07", "r") as data:
    for line in data:
        line = line.strip()
        assert line[-1] == ".", "Input should end with '.'"
        line = line[:-1]  # remove trailing .
        outer_bag, content = line.split(" bags contain ")
        if content == "no other bags":
            bag_contents[outer_bag] = None
        else:
            for contained_bags in content.split(", "):
                match = CONTAINED_BAGS.match(contained_bags)
                assert match, "Unable to parse '{}' in line '{}'".format(
                        contained_bags, line)
                bag_count, contained_bag = match.groups()
                bags_containing.setdefault(contained_bag, []).append(outer_bag)
                bag_contents.setdefault(outer_bag, []).append(
                        ContainedBags(int(bag_count), contained_bag))


# Part 1

possible_containers = set()
bags_to_consider = ["shiny gold"]

while len(bags_to_consider) > 0:
    bag = bags_to_consider.pop()
    possible_containers.add(bag)
    for containers in bags_containing.get(bag, []):
        bags_to_consider.append(containers)

possible_containers.remove("shiny gold")

print("Part 1: ", len(possible_containers))


# Part 2

def count_bags_in(bag: str) -> int:
    # from pdb import set_trace; set_trace()
    if bag_contents[bag] is None:
        return 0
    else:
        sum_of_bags = 0
        for contained_bag in bag_contents[bag]:
            sum_of_bags += contained_bag.count * (1 + count_bags_in(contained_bag.color))
        # print(f"one {bag} bag contains {sum_of_bags} bags")
        return sum_of_bags


print("Part 2: ", count_bags_in("shiny gold"))
