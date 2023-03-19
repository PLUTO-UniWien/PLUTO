from enum import Enum

import streamlit as st

from pluto_survey_tools.app.state import AppState


class GeneralSettingsState(Enum):
    weights_min = (0, -12)
    weights_max = (1, 12)


def render():
    min_value, max_value = st.slider(
        label="Set min and max weight values",
        min_value=-25,
        max_value=25,
        value=(
            AppState.get(GeneralSettingsState.weights_min),
            AppState.get(GeneralSettingsState.weights_max),
        ),
        help="The values you set here will be used on the 'Question Weights' tab "
        "as the slider's range.",
    )
    AppState.set(GeneralSettingsState.weights_min, min_value)
    AppState.set(GeneralSettingsState.weights_max, max_value)
