from pluto_survey_tools import QUESTIONNAIRE
from enum import Enum


class QuestionnaireState(Enum):
    base_questionnaire = QUESTIONNAIRE.copy()
    edited_questionnaire = QUESTIONNAIRE.copy()
