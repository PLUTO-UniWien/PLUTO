from os import getenv

import streamlit as st

from survey_analysis.app import (
    export_options,
    histo_heatmap,
    histo_heatmap_raw,
    how_to_use,
    question_weights_toolbar,
    question_weigths,
)
from survey_analysis.app.auth import check_password

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

    tab_heatmap, tab_raw, tab_how_to_use = st.tabs(
        ["Heatmap", "Raw Data", "How to use this tool"]
    )

    with tab_heatmap:
        histo_heatmap.render()

    with tab_raw:
        histo_heatmap_raw.render()

    with tab_how_to_use:
        how_to_use.render()
