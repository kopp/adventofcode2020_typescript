
def transform_subject_number(subject_number, loop_size):
    value = 1
    for i in range(loop_size):
        value = (value * subject_number) % 20201227
    return value


def find_loop_size_for_public_key(public_key):
    subject_number = 7
    value = 1
    loop_size = 0
    while value != public_key:
        value = (value * subject_number) % 20201227
        loop_size += 1
    return loop_size


assert find_loop_size_for_public_key(5764801) == 8
assert find_loop_size_for_public_key(17807724) == 11


def get_encryption_key(public_key_1, public_key_2):
    loop_size_1 = find_loop_size_for_public_key(public_key_1)
    loop_size_2 = find_loop_size_for_public_key(public_key_2)
    encryption_key_1 = transform_subject_number(public_key_1, loop_size_2)
    encryption_key_2 = transform_subject_number(public_key_2, loop_size_1)
    assert encryption_key_1 == encryption_key_2
    return encryption_key_1


assert get_encryption_key(5764801, 17807724) == 14897079


print("Problem 1: ", get_encryption_key(14082811, 5249543))