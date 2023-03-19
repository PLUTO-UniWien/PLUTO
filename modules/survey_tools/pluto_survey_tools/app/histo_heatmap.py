from enum import Enum

import streamlit as st

import pluto_survey_tools.charts as charts
import pluto_survey_tools.model as model
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState


class HistoHeatmapConfigState(Enum):
    normalize = (0, True)
    with_zero_line = (1, True)
    show_base = (2, True)
    show_edited = (3, False)


def render():
    # @st.cache_data
    def get_histo_heatmap(q1: model.Questionnaire, q2: model.Questionnaire):
        normalize = AppState.get(HistoHeatmapConfigState.normalize)
        with_zero_line = AppState.get(HistoHeatmapConfigState.with_zero_line)
        show_base = AppState.get(HistoHeatmapConfigState.show_base)
        show_edited = AppState.get(HistoHeatmapConfigState.show_edited)
        # Shifting the legend to the left to make room
        # for the labels in absolute units if `not normalize` is True
        kwargs = dict(**(not normalize and dict(legendX=-200) or dict()))
        return charts.create_histo_heatmap(
            q1,
            q2,
            normalize=normalize,
            with_zero_line=with_zero_line,
            show_base=show_base,
            show_edited=show_edited,
            **kwargs
        )

    base_questionnaire = AppState.get(QuestionnaireState.base_questionnaire)
    edited_questionnaire = AppState.get(QuestionnaireState.edited_questionnaire)
    histo_heatmap = get_histo_heatmap(base_questionnaire, edited_questionnaire)
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
