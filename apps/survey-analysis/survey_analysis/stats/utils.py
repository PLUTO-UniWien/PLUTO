from itertools import combinations
from typing import Generator


def all_possible_sums_gen(n: int, nums: list[float]) -> Generator[float, None, None]:
    """
    This function returns a generator object that yields
    the possible sums of the elements.

    :param n: maximum number of elements that can be used
    :param nums: list of floats to sum
    :return: possible sums
    """
    for i in range(1, min(n + 1, len(nums))):
        for comb in combinations(nums, i):
            yield sum(comb)


def all_possible_sums_gen_with_count(
    n: int, nums: list[float]
) -> Generator[tuple[int, float], None, None]:
    """
    This function returns a generator object that yields
    tuples of the number of elements used
    and the corresponding sum of the elements.

    :param n: maximum number of elements that can be used
    :param nums: list of floats to sum
    :return: tuple of the number of elements used and the corresponding sum
    """
    for i in range(1, min(n + 1, len(nums))):
        for comb in combinations(nums, i):
            yield i, sum(comb)
