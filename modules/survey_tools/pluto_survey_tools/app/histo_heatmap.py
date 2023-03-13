import streamlit as st

import pluto_survey_tools.charts as charts
import pluto_survey_tools.model as model
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState


def render():
    # @st.cache_data
    def get_histo_heatmap(q1: model.Questionnaire, q2: model.Questionnaire):
        return charts.create_histo_heatmap(q1, q2)

    AppState.get(QuestionnaireState.base_questionnaire)
    edited_questionnaire = AppState.get(QuestionnaireState.edited_questionnaire)
    histo_heatmap = get_histo_heatmap(edited_questionnaire, edited_questionnaire)
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
