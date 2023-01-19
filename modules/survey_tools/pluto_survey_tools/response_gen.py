import pluto_survey_tools.model as model
import pluto_survey_tools.stats as stats
import random
from typing import Generator
import pandas as pd
from dataclasses import asdict


def random_response(section_id: str, section_title: str,
                    question_id: str, question_body: str,
                    min_sum: float, max_sum: float,
                    question: model.Question) -> model.ResponseRow:
    """Return a random response for a question."""
    num_choices = random.randint(question.selection_range.start, question.selection_range.end)
    choices: list[model.AnswerChoice] = random.sample(question.choices, num_choices)
    score_sum = sum(c.score for c in choices)
    return model.ResponseRow(section_id, section_title,
                             question_id, question_body, choices,
                             min_sum, max_sum, score_sum)


def random_questionnaire_responses_gen(questionnaire: model.Questionnaire) -> Generator[model.ResponseRow, None, None]:
    """Return a list of random responses for a questionnaire."""
    s, q = 1, 1
    for section in questionnaire.sections:
        for question in section.questions:
            min_sum, max_sum = stats.score_range_question(question)
            section_id = f'A{s}'
            question_id = f'{section_id}.{q}'
            q += 1
            yield random_response(section_id, section.title, question_id, question.body, min_sum, max_sum, question)
        s += 1


def random_questionnaire_responses_df(questionnaire: model.Questionnaire) -> pd.DataFrame:
    """Return a DataFrame of random responses for a questionnaire."""
    responses = random_questionnaire_responses_gen(questionnaire)
    response_dicts = [asdict(r) for r in responses]
    return pd.DataFrame(response_dicts)
