import streamlit as st

import pluto_survey_tools.charts as charts
import pluto_survey_tools.model as model


def render(
    *,
    base_questionnaire: model.Questionnaire,
    edited_questionnaire: model.Questionnaire
):
    @st.cache_data
    def get_histo_heatmap(q1: model.Questionnaire, q2: model.Questionnaire):
        return charts.create_histo_heatmap(q1, q2)

    histo_heatmap = get_histo_heatmap(base_questionnaire, edited_questionnaire)
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
