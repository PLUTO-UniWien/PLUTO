from dataclasses import dataclass, replace, asdict


@dataclass(frozen=True)
class SelectionRange:
    start: int
    end: int

    @staticmethod
    def from_dict(d: dict):
        return SelectionRange(d['start'], d['end'])


@dataclass(frozen=True)
class AnswerChoice:
    body: str
    score: float

    @staticmethod
    def from_dict(d: dict):
        return AnswerChoice(d['body'], d['score'])


@dataclass(frozen=True)
class Question:
    body: str
    selection_range: SelectionRange
    choices: list[AnswerChoice]
    impact_keys: list[str]

    @staticmethod
    def from_dict(d: dict):
        return Question(
            d['body'],
            SelectionRange.from_dict(d['selection_range']),
            [AnswerChoice.from_dict(c) for c in d['choices']],
            d['impact_keys'],
        )

    @property
    def choice_scores(self) -> list[float]:
        """Return a list of the scores for each choice."""
        return [c.score for c in self.choices]


@dataclass(frozen=True)
class Section:
    title: str
    questions: list[Question]

    @staticmethod
    def from_dict(d: dict):
        return Section(
            d['title'],
            [Question.from_dict(q) for q in d['questions']],
        )


@dataclass(frozen=True)
class Questionnaire:
    title: str
    sections: list[Section]

    @staticmethod
    def from_dict(d: dict):
        return Questionnaire(
            d['title'],
            [Section.from_dict(s) for s in d['sections']],
        )

    @property
    def questions(self) -> list[Question]:
        """Return a list of all questions in the questionnaire."""
        return [q for s in self.sections for q in s.questions]

    def copy(self) -> 'Questionnaire':
        """Return a copy of the questionnaire."""
        return Questionnaire.from_dict(asdict(self))

    def with_choice_scores(self, scores: list[float]) -> 'Questionnaire':
        """Return a copy of the questionnaire with the given choice scores."""
        self_dict = asdict(self)
        curr_scores = scores.copy()
        for i, section in enumerate(self.sections):
            for j, question in enumerate(section.questions):
                num_choices = len(question.choices)
                question_scores = curr_scores[:num_choices]
                curr_scores = curr_scores[num_choices:]
                edited_choices = [asdict(replace(c, score=s)) for c, s in zip(question.choices, question_scores)]
                self_dict['sections'][i]['questions'][j]['choices'] = edited_choices

        return Questionnaire.from_dict(self_dict)

    @property
    def choice_scores(self) -> list[float]:
        """Return a list of the scores for each choice."""
        return [c.score for q in self.questions for c in q.choices]


@dataclass(frozen=True)
class ResponseRow:
    section_id: str
    section_title: str
    question_id: str
    question_body: str
    choices: list[AnswerChoice]
    min_sum: float
    max_sum: float
    score_sum: float

    @staticmethod
    def from_dict(d: dict):
        return ResponseRow(
            d['section_id'],
            d['section_title'],
            d['question_id'],
            d['question_body'],
            [AnswerChoice.from_dict(c) for c in d['choices']],
            d['min_sum'],
            d['max_sum'],
            d['score_sum'],
        )
