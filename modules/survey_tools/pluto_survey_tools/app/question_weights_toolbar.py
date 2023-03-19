from enum import Enum

import streamlit as st

import pluto_survey_tools.model as model
from pluto_survey_tools.app.histo_heatmap import HistoHeatmapConfigState
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


def _toggle_bool_state(state: Enum):
    def toggle():
        curr = AppState.get(state)
        AppState.set(state, not curr)

    return toggle


def _handle_show_base_selected():
    AppState.set(HistoHeatmapConfigState.show_base, True)
    AppState.set(HistoHeatmapConfigState.show_edited, False)


def _handle_show_edited_selected():
    AppState.set(HistoHeatmapConfigState.show_base, False)
    AppState.set(HistoHeatmapConfigState.show_edited, True)


def _handle_show_both_selected():
    AppState.set(HistoHeatmapConfigState.show_base, True)
    AppState.set(HistoHeatmapConfigState.show_edited, True)


def _toggle_normalize():
    normalize_curr = AppState.get(HistoHeatmapConfigState.normalize)
    AppState.set(HistoHeatmapConfigState.normalize, not normalize_curr)


def _toggle_with_zero_line():
    with_zero_line_curr = AppState.get(HistoHeatmapConfigState.with_zero_line)
    AppState.set(HistoHeatmapConfigState.with_zero_line, not with_zero_line_curr)


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

    with st.expander(label="Chart Configuration", expanded=True):
        st.checkbox(
            "Normalize counts",
            help="If checked, the counts will be shown as relative percentages "
            "instead of absolute values.",
            value=AppState.get(HistoHeatmapConfigState.normalize),
            on_change=_toggle_bool_state(HistoHeatmapConfigState.normalize),
        )
        st.checkbox(
            "Show zero lines",
            help="If checked, guidelines will be shown at zero-points of the axes",
            value=AppState.get(HistoHeatmapConfigState.with_zero_line),
            on_change=_toggle_bool_state(HistoHeatmapConfigState.with_zero_line),
        )
        display_options = ("Base", "Edited", "Both")
        display_selection = st.radio(
            "Displayed questionnaire",
            help="Choose which questionnaire frequencies to display "
            "on the histogram heatmap.",
            options=display_options,
            index=display_options.index("Both"),
        )
        display_selection_index = display_options.index(display_selection)
        [
            _handle_show_base_selected,
            _handle_show_edited_selected,
            _handle_show_both_selected,
        ][display_selection_index]()

        opacity_base_value = st.slider(
            "Base opacity",
            help="Adjust the opacity of the base questionnaire's histogram heatmap.",
            min_value=0.0,
            max_value=1.0,
            value=AppState.get(HistoHeatmapConfigState.opacity_base),
            step=0.05,
        )
        AppState.set(HistoHeatmapConfigState.opacity_base, opacity_base_value)

        opacity_edited_value = st.slider(
            "Edited opacity",
            help="Adjust the opacity of the edited questionnaire's histogram heatmap.",
            min_value=0.0,
            max_value=1.0,
            value=AppState.get(HistoHeatmapConfigState.opacity_edited),
            step=0.05,
        )
        AppState.set(HistoHeatmapConfigState.opacity_edited, opacity_edited_value)
