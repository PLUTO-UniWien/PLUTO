import json
from dataclasses import asdict

import streamlit as st

import survey_analysis.model as model
from survey_analysis.app.questionnaire import QuestionnaireState
from survey_analysis.app.state import AppState


def render():
    edited_questionnaire: model.Questionnaire = AppState.get(
        QuestionnaireState.edited_questionnaire
    )
    # Export as JSON
    st.download_button(
        label="Download JSON",
        data=json.dumps(asdict(edited_questionnaire), indent=2),
        file_name="pluto_questionnaire.json",
        mime="application/json",
        help="Download the edited questionnaire as a JSON file.",
    )
