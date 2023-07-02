from enum import Enum

import streamlit as st

import survey_analysis.app.utils as st_utils
import survey_analysis.charts.utils as chart_utils
import survey_analysis.model as model
from survey_analysis.app.histo_heatmap import HistoHeatmapConfigState
from survey_analysis.app.questionnaire import QuestionnaireState
from survey_analysis.app.state import AppState


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
    # Show only the edited questionnaire
    AppState.set(HistoHeatmapConfigState.show_base, False)
    AppState.set(HistoHeatmapConfigState.show_edited, True)


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
        show_base_curr = AppState.get(HistoHeatmapConfigState.show_base)
        show_edited_curr = AppState.get(HistoHeatmapConfigState.show_edited)
        display_selection_index = (
            2 if show_base_curr and show_edited_curr else 1 if show_edited_curr else 0
        )
        display_selection = st.radio(
            "Displayed questionnaire",
            help="Choose which questionnaire frequencies to display "
            "on the histogram heatmap.",
            options=display_options,
            index=display_selection_index,
            horizontal=True,
        )
        display_selection_index = display_options.index(display_selection)
        [
            _handle_show_base_selected,
            _handle_show_edited_selected,
            _handle_show_both_selected,
        ][display_selection_index]()

        grid = st_utils.make_grid(rows=2, cols=2)

        with grid[0][0]:
            st.subheader("Base Questionnaire")
            opacity_base_value = st.slider(
                "Opacity",
                help="Adjust the opacity of the base "
                "questionnaire's histogram heatmap.",
                min_value=0.0,
                max_value=1.0,
                value=AppState.get(HistoHeatmapConfigState.opacity_base),
                step=0.05,
            )
            AppState.set(HistoHeatmapConfigState.opacity_base, opacity_base_value)

        with grid[1][0]:
            color_scheme_base_default = HistoHeatmapConfigState.scheme_base.value[1]
            color_scheme_base = st.selectbox(
                key="base",
                label="Color Scheme",
                options=chart_utils.VEGA_LITE_COLOR_SCHEMES,
                index=chart_utils.VEGA_LITE_COLOR_SCHEMES.index(
                    color_scheme_base_default
                ),
                help=f"Choose a color scheme for the base questionnaire's heatmap. "
                f"See all options [here]({chart_utils.VEGA_LITE_COLOR_SCHEMES_URL}).",
            )
            AppState.set(HistoHeatmapConfigState.scheme_base, color_scheme_base)

        with grid[0][1]:
            st.subheader("Edited Questionnaire")
            opacity_edited_value = st.slider(
                "Opacity",
                help="Adjust the opacity of the edited"
                " questionnaire's histogram heatmap.",
                min_value=0.0,
                max_value=1.0,
                value=AppState.get(HistoHeatmapConfigState.opacity_edited),
                step=0.05,
            )
            AppState.set(HistoHeatmapConfigState.opacity_edited, opacity_edited_value)

        with grid[1][1]:
            color_scheme_edited_default = HistoHeatmapConfigState.scheme_edited.value[1]
            color_scheme_edited = st.selectbox(
                key="edited",
                label="Color Scheme",
                options=chart_utils.VEGA_LITE_COLOR_SCHEMES,
                index=chart_utils.VEGA_LITE_COLOR_SCHEMES.index(
                    color_scheme_edited_default
                ),
                help=f"Choose a color scheme for the edited questionnaire's heatmap. "
                f"See all options [here]({chart_utils.VEGA_LITE_COLOR_SCHEMES_URL}).",
            )
            AppState.set(HistoHeatmapConfigState.scheme_edited, color_scheme_edited)
