import streamlit as st
import pluto_survey_tools.model as model
from pluto_survey_tools.app.state import AppState
from pluto_survey_tools.app.questionnaire import QuestionnaireState
from pluto_survey_tools.app.general_settings import GeneralSettingsState


def render(*, base_questionnaire: model.Questionnaire):
    choice_scores = []
    question_num = 0
    for i, section in enumerate(base_questionnaire.sections):
        section_title = f'Section {i + 1}: {section.title}'
        st.header(section_title)
        for j, question in enumerate(section.questions):
            question_num += 1
            question_title = question.body[len('Which of the answers below best describe the '):-1].capitalize()
            question_axis = question.impact_keys[0].capitalize()
            with st.expander(f"Q{question_num}: {question_title} ({question_axis})"):
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

    edited_questionnaire = base_questionnaire.with_choice_scores(choice_scores)
    AppState.set(QuestionnaireState.edited_questionnaire, edited_questionnaire)
