from os import getenv

import streamlit as st

from pluto_survey_tools.app import (
    export_options,
    histo_heatmap,
    how_to_use,
    question_weights_toolbar,
    question_weigths,
)
from pluto_survey_tools.app.auth import check_password

st.write("# PLUTO Survey Tools")
if getenv("LOCAL", False) or check_password():
    with st.sidebar:
        tab_question_weights, tab_export_options = st.tabs(
            ["Question Weights", "Export Options"]
        )

        with tab_question_weights:
            question_weights_toolbar.render()
            question_weigths.render()

        with tab_export_options:
            export_options.render()

    tab_heatmap, tab_how_to_use = st.tabs(["Heatmap", "How to use this tool"])

    with tab_heatmap:
        st.write("## Distribution of possible answers")
        histo_heatmap.render()

    with tab_how_to_use:
        how_to_use.render()
