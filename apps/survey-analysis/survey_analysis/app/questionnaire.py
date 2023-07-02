from enum import Enum

from survey_analysis import QUESTIONNAIRE


def _base_questionnaire():
    return QUESTIONNAIRE.copy()


def _edited_questionnaire():
    return QUESTIONNAIRE.copy()


class QuestionnaireState(Enum):
    base_questionnaire = (0, _base_questionnaire())
    edited_questionnaire = (1, _edited_questionnaire())
