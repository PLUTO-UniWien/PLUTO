from enum import Enum

import streamlit as st

import pluto_survey_tools.charts as charts
import pluto_survey_tools.model as model
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState


class HistoHeatmapConfigState(Enum):
    normalize = (0, False)
    with_zero_line = (1, True)
    show_base = (2, True)
    show_edited = (3, True)
    opacity_base = (4, 1.0)
    opacity_edited = (5, 0.75)


def render():
    @st.cache_data
    def get_histo_heatmap(
        q1: model.Questionnaire,
        q2: model.Questionnaire,
        normalize: bool,
        with_zero_line: bool,
        show_base: bool,
        show_edited: bool,
        opacity_base: float,
        opacity_edited: float,
    ):
        return charts.create_histo_heatmap(
            q1,
            q2,
            normalize=normalize,
            with_zero_line=with_zero_line,
            show_base=show_base,
            show_edited=show_edited,
            opacity_base=opacity_base,
            opacity_edited=opacity_edited,
        )

    histo_heatmap = get_histo_heatmap(
        q1=AppState.get(QuestionnaireState.base_questionnaire),
        q2=AppState.get(QuestionnaireState.edited_questionnaire),
        normalize=AppState.get(HistoHeatmapConfigState.normalize),
        with_zero_line=AppState.get(HistoHeatmapConfigState.with_zero_line),
        show_base=AppState.get(HistoHeatmapConfigState.show_base),
        show_edited=AppState.get(HistoHeatmapConfigState.show_edited),
        opacity_base=AppState.get(HistoHeatmapConfigState.opacity_base),
        opacity_edited=AppState.get(HistoHeatmapConfigState.opacity_edited),
    )
    st.write("## Distribution of possible answers")
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
