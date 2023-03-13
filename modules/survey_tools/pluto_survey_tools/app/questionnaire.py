from enum import Enum

from pluto_survey_tools import QUESTIONNAIRE


def _base_questionnaire():
    return QUESTIONNAIRE.copy()


def _edited_questionnaire():
    value = QUESTIONNAIRE.copy()
    choice_scores = value.choice_scores
    choice_scores[0] += 1
    return value.with_choice_scores(choice_scores)


class QuestionnaireState(Enum):
    base_questionnaire = _base_questionnaire()
    edited_questionnaire = _edited_questionnaire()
