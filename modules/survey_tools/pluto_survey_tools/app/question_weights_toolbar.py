import streamlit as st

import pluto_survey_tools.model as model
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState


def _reset_weights_to_original_values():
    AppState.reset(QuestionnaireState.base_questionnaire)
    AppState.reset(QuestionnaireState.edited_questionnaire)


def _set_all_weights_to_zero():
    base_questionnaire: model.Questionnaire = AppState.get(
        QuestionnaireState.base_questionnaire
    )
    num_scores = len(base_questionnaire.choice_scores)
    new_scores = [0] * num_scores
    edited_questionnaire = base_questionnaire.copy().with_choice_scores(new_scores)
    AppState.set(QuestionnaireState.edited_questionnaire, edited_questionnaire)


def render():
    st.button(
        "Reset original weights",
        help="The weights will be reset to the original survey's values.",
        on_click=_reset_weights_to_original_values,
    )
    st.button(
        "Set all weights to 0",
        help="The weights will be set to 0 for all questions, "
        "making it possible to adjust the distribution from scratch.",
        on_click=_set_all_weights_to_zero,
    )
