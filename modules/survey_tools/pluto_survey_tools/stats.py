import pluto_survey_tools.model as model

from itertools import combinations
from typing import Generator


def all_possible_sums_gen(n: int, nums: list[float]) -> Generator[tuple[int, float], None, None]:
    """
    This function returns a generator object that yields tuple of the number of elements used
    and the corresponding sum of the elements.

    :param n: maximum number of elements that can be used
    :param nums: list of floats to sum
    :return: tuple of the number of elements used and the corresponding sum
    """
    for i in range(1, min(n + 1, len(nums))):
        for comb in combinations(nums, i):
            yield i, sum(comb)


def score_range_question(question: model.Question) -> tuple[float, float]:
    """Return the range of possible scores for a range question."""
    scores = [c.score for c in question.choices]
    all_possible_sums = all_possible_sums_gen(question.selection_range.end, scores)
    all_possible_sums_sorted = sorted(all_possible_sums, key=lambda x: x[1])
    _, lowest = all_possible_sums_sorted[0]
    _, highest = all_possible_sums_sorted[-1]
    return lowest, highest


def score_range_section(section: model.Section) -> tuple[float, float]:
    """Return the range of possible scores for a section."""
    question_score_ranges = [score_range_question(q) for q in section.questions]
    question_score_ranges_transposed = zip(*question_score_ranges)
    min_sum, max_sum = tuple(map(sum, question_score_ranges_transposed))
    return min_sum, max_sum


def score_range_questionnaire(questionnaire: model.Questionnaire) -> tuple[float, float]:
    """Return the range of possible scores for a questionnaire."""
    section_score_ranges = [score_range_section(s) for s in questionnaire.sections]
    section_score_ranges_transposed = zip(*section_score_ranges)
    min_sum, max_sum = tuple(map(sum, section_score_ranges_transposed))
    return min_sum, max_sum
