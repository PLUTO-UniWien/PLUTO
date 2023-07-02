from dataclasses import replace

from .model import Question


def questions_with_impact(questions: list[Question], key: str) -> list[Question]:
    """
    Return a list of questions with the given impact key.
    :param questions: A list of questions.
    :param key: The impact key to search for.
    :return: A list of questions with the given impact key.
    """
    return [replace(q) for q in questions if key in q.impact_keys]
