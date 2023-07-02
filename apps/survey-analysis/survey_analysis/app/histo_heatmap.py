from enum import Enum

import streamlit as st

import survey_analysis.charts as charts
import survey_analysis.model as model
from survey_analysis.app.questionnaire import QuestionnaireState
from survey_analysis.app.state import AppState


class HistoHeatmapConfigState(Enum):
    normalize = (0, False)
    with_zero_line = (1, True)
    show_base = (2, True)
    show_edited = (3, True)
    opacity_base = (4, 1.0)
    opacity_edited = (5, 0.90)
    scheme_base = (6, "plasma")
    scheme_edited = (7, "bluegreen")


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
        scheme_base: str,
        scheme_edited: str,
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
            scheme_base=scheme_base,
            scheme_edited=scheme_edited,
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
        scheme_base=AppState.get(HistoHeatmapConfigState.scheme_base),
        scheme_edited=AppState.get(HistoHeatmapConfigState.scheme_edited),
    )
    st.write("## Distribution of possible answers")
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
