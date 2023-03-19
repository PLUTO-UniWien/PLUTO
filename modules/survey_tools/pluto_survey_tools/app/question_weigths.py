import streamlit as st

import pluto_survey_tools.model as model
from pluto_survey_tools.app.general_settings import GeneralSettingsState
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.state import AppState

question_axis_map = {
    "x": "Benefits",
    "y": "Public value",
}


def render():
    edited_questionnaire: model.Questionnaire = AppState.get(
        QuestionnaireState.edited_questionnaire
    )
    choice_scores = []
    question_num = 0
    for i, section in enumerate(edited_questionnaire.sections):
        section_title = f"Section {i + 1}: {section.title}"
        st.header(section_title)
        for j, question in enumerate(section.questions):
            question_num += 1
            question_title = question.body[
                len("Which of the answers below best describe the ") : -1
            ].capitalize()
            question_axis = question.impact_keys[0]
            question_axis_name = question_axis_map[question_axis]
            with st.expander(
                f"Q{question_num}: {question_title} "
                f"( *{question_axis_name} - {question_axis.capitalize()}* )"
            ):
                for k, choice in enumerate(question.choices):
                    choice_title = f"**A{question_num}.{k + 1}**: *{choice.body}*"
                    choice_score = st.slider(
                        choice_title,
                        min_value=int(AppState.get(GeneralSettingsState.weights_min)),
                        max_value=int(AppState.get(GeneralSettingsState.weights_max)),
                        value=int(choice.score),
                        step=1,
                    )
                    choice_scores.append(choice_score)

    edited_questionnaire = edited_questionnaire.with_choice_scores(choice_scores)
    AppState.set(QuestionnaireState.edited_questionnaire, edited_questionnaire)
