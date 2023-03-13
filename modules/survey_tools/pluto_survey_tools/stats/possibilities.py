import math
from functools import reduce
from operator import mul

import pluto_survey_tools.model as model


def num_possibilities_question(question: model.Question) -> int:
    """Return the number of possible responses for a question."""
    num_choices = len(question.choices)
    max_choices = question.selection_range.end
    return sum(math.comb(num_choices, i) for i in range(1, max_choices + 1))


def num_possibilities_section(section: model.Section) -> int:
    """Return the number of possible responses for a section."""
    num_possibilities_questions = (
        num_possibilities_question(q) for q in section.questions
    )
    return reduce(mul, num_possibilities_questions, 1)


def num_possibilities_questionnaire(questionnaire: model.Questionnaire) -> int:
    """Return the number of possible responses for a questionnaire."""
    num_possibilities_sections = (
        num_possibilities_section(s) for s in questionnaire.sections
    )
    return reduce(mul, num_possibilities_sections, 1)
