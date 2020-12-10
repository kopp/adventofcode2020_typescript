import numpy
from typing import List


with open("input/day10", "r") as data:
    values = [0]  # include charging outlet
    for line in data:
        value = int(line.strip())
        values.append(value)

values_sorted = sorted(values)
values_sorted.append(values_sorted[-1] + 3)  # include device charger


deltas = numpy.diff(values_sorted)
# print([str(item) for item in zip(values_sorted, deltas)])
distribution, edges = numpy.histogram(deltas, [0, 1, 2, 3, 4])
assert distribution[0] == 0
assert distribution[2] == 0

solution1 = distribution[1] * distribution[3]

print("Problem 1: ", solution1)


# Part 2
# From consecutive delta=1's it is possible to remove some 1es.
# The individual blocks of 1es do not "interact" with each other.
# Thus if we know the number of possible combinations for every block, we can
# simply multiply these numbers to get the total number of configurations.

def valid_combinations_for_blocks_of_size(n: int) -> List[str]:
    """
    A block consists of `n` elements.
    We are interested in combinations that either use or discard the elements
    in the block.
    A block is valid if there are at most two discarded elements between two
    used elements and at most two discarded elements at the beginning or end.
    """
    # A simple representation for a block is a binary number with n digits -- 0
    # for a discarded and 1 for a used element.
    # It is invalid if `000` is contained.
    # Special cases:
    formatstring = "{{:0{}b}}".format(n)
    possible_combinations = [formatstring.format(i) for i in range(2**n)]
    valid_combinations = [combination for combination in possible_combinations if "000" not in combination]
    return valid_combinations


def get_blocks_of_1es(numbers: List[int]) -> List[int]:
    """
    Find blocks of consecutive 1es that are "sandwiched" between two
    different values or between value and begin/end in a list of numbers.
    For each block, return the length of the block.
    """
    block_sizes = []
    index_block_begin = 0
    for index, number in enumerate(numbers):
        if index_block_begin is None and number == 1:
            index_block_begin = index
        if number != 1 and index_block_begin is not None:
            block_size = index - index_block_begin
            block_sizes.append(block_size)
            index_block_begin = None
    if numbers[-1] == 1:
        block_size = len(numbers) - index_block_begin
        block_sizes.append(block_size)
    return block_sizes


block_lengths = get_blocks_of_1es(list(deltas))
total_combinations = 1

for block_length in block_lengths:
    # The last element in a block of 1es needs to be kept (as the delta to the
    # next element is 3), so only block_length - 1 elements are variable.
    if block_length == 1:
        continue
    combinations = valid_combinations_for_blocks_of_size(block_length - 1)
    total_combinations *= len(combinations)

print("Problem 2: ", total_combinations)
