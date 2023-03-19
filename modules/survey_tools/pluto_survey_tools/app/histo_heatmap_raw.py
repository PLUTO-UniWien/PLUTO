import streamlit as st

import pluto_survey_tools.app.utils as st_utils
import pluto_survey_tools.model as model
from pluto_survey_tools.app.histo_heatmap import HistoHeatmapConfigState
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState
from pluto_survey_tools.stats.frequencies import score_count_df_keyed


def render():
    @st.cache_data
    def get_histo_heatmap_raw_data(
        q1: model.Questionnaire, q2: model.Questionnaire, normalize: bool
    ):
        d1 = score_count_df_keyed(questions=q1.questions, normalize=normalize)
        d2 = score_count_df_keyed(questions=q2.questions, normalize=normalize)
        return d1, d2

    df1, df2 = get_histo_heatmap_raw_data(
        q1=AppState.get(QuestionnaireState.base_questionnaire),
        q2=AppState.get(QuestionnaireState.edited_questionnaire),
        normalize=AppState.get(HistoHeatmapConfigState.normalize),
    )
    st.write("## Raw Heatmap Data")

    heatmap_data_grid = st_utils.make_grid(cols=2, rows=1)
    with heatmap_data_grid[0][0]:
        st.write("#### Base questionnaire")
        st.dataframe(df1)
    with heatmap_data_grid[0][1]:
        st.write("#### Edited questionnaire")
        st.dataframe(df2)

    st.write("## Raw Histogram Data")

    histogram_data_grid = st_utils.make_grid(2, 2)
    with histogram_data_grid[0][0]:
        st.write("#### Base questionnaire")
        st.write("##### Benefits *(x-axis)*")
        st.dataframe(
            df1.copy().groupby("score_x").sum().reset_index()[["score_x", "count"]]
        )
    with histogram_data_grid[1][0]:
        st.write("##### Public Value *(y-axis)*")
        st.dataframe(
            df1.copy().groupby("score_y").sum().reset_index()[["score_y", "count"]]
        )

    with histogram_data_grid[0][1]:
        st.write("#### Edited questionnaire")
        st.write("##### Benefits *(x-axis)*")
        st.dataframe(
            df2.copy().groupby("score_x").sum().reset_index()[["score_x", "count"]]
        )
    with histogram_data_grid[1][1]:
        st.write("##### Public Value *(y-axis)*")
        st.dataframe(
            df2.copy().groupby("score_y").sum().reset_index()[["score_y", "count"]]
        )
