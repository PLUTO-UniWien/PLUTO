import pluto_survey_tools.model as model
from .utils import all_possible_sums_gen


def score_range_question(question: model.Question) -> tuple[float, float]:
    """Return the range of possible scores for a range question."""
    scores = [c.score for c in question.choices]
    all_possible_sums = all_possible_sums_gen(question.selection_range.end, scores)
    all_possible_sums_sorted = sorted(all_possible_sums)
    lowest = all_possible_sums_sorted[0]
    highest = all_possible_sums_sorted[-1]
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
