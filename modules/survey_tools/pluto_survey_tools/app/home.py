import streamlit as st
from pluto_survey_tools.app.auth import check_password
from pluto_survey_tools import QUESTIONNAIRE
import pluto_survey_tools.model as model
import pluto_survey_tools.charts as charts

st.title("PLUTO - Survey Tools Prototype")


@st.cache_data
def get_base_questionnaire() -> model.Questionnaire:
    return QUESTIONNAIRE.copy()


@st.cache_data
def get_edited_questionnaire(slider_values: list[float]) -> model.Questionnaire:
    return base_questionnaire.with_choice_scores(slider_values)


@st.cache_data
def get_histo_heatmap(q1: model.Questionnaire, q2: model.Questionnaire):
    return charts.create_histo_heatmap(q1, q2)


base_questionnaire = get_base_questionnaire()
choice_scores: list[float] = []

if check_password():
    with st.sidebar:
        st.write("# Question Weights")
        question_num = 0
        for i, section in enumerate(base_questionnaire.sections):
            section_title = f'Section {i + 1}: {section.title}'
            st.header(section_title)
            for j, question in enumerate(section.questions):
                question_num += 1
                question_title = question.body[len('Which of the answers below best describe the '):-1].capitalize()
                with st.expander(f"Q{question_num}: {question_title}"):
                    for k, choice in enumerate(question.choices):
                        choice_title = f"**A{question_num}.{k + 1}**: *{choice.body}*"
                        choice_score = st.slider(
                            choice_title,
                            min_value=-7.5,
                            max_value=7.5,
                            value=choice.score,
                            step=0.5,
                        )
                        choice_scores.append(choice_score)

    # Build the edited questionnaire with the new choice scores, obtained from the sliders
    edited_questionnaire = get_edited_questionnaire(choice_scores)

    histo_heatmap = get_histo_heatmap(base_questionnaire, edited_questionnaire)
    st.altair_chart(histo_heatmap, use_container_width=True, theme=None)
