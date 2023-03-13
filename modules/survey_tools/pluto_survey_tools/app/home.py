import streamlit as st
from pluto_survey_tools.app.auth import check_password
import pluto_survey_tools.model as model
from pluto_survey_tools.app.state import AppState

from pluto_survey_tools.app import (question_weigths,
                                    histo_heatmap,
                                    general_settings,
                                    export_options,
                                    how_to_use, questionnaire)
from os import getenv


def get_base_questionnaire() -> model.Questionnaire:
    return AppState.get(questionnaire.QuestionnaireState.base_questionnaire)


def get_edited_questionnaire() -> model.Questionnaire:

    return AppState.get(questionnaire.QuestionnaireState.edited_questionnaire)


st.write("# PLUTO Survey Tools")
if getenv('LOCAL', False) or check_password():
    with st.sidebar:
        tab_question_weights, tab_general_settings, tab_export_options = st.tabs(
            ["Question Weights", "General Settings", "Export Options"]
        )

        with tab_question_weights:
            question_weigths.render(base_questionnaire=get_base_questionnaire())

        with tab_general_settings:
            general_settings.render()

        with tab_export_options:
            export_options.render(edited_questionnaire=get_edited_questionnaire())

    tab_heatmap, tab_how_to_use = st.tabs(["Heatmap", "How to use this tool"])

    with tab_heatmap:
        st.write("## Distribution of possible answers")
        histo_heatmap.render(base_questionnaire=get_base_questionnaire(),
                             edited_questionnaire=get_edited_questionnaire())

    with tab_how_to_use:
        how_to_use.render()
