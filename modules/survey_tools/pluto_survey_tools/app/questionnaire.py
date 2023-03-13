from enum import Enum

from pluto_survey_tools import QUESTIONNAIRE


class QuestionnaireState(Enum):
    base_questionnaire = QUESTIONNAIRE.copy()
    edited_questionnaire = QUESTIONNAIRE.copy()
