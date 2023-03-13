import json
from dataclasses import asdict

import streamlit as st

import pluto_survey_tools.model as model


def render(*, edited_questionnaire: model.Questionnaire):
    # Export as JSON
    st.download_button(
        label="Download JSON",
        data=json.dumps(asdict(edited_questionnaire), indent=2),
        file_name="pluto_questionnaire.json",
        mime="application/json",
    )
