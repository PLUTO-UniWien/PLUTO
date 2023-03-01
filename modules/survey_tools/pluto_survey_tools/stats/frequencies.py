import pluto_survey_tools.model as model
import pandas as pd
from collections import Counter
from .utils import all_possible_sums_gen
from functools import reduce


def _merge_counters(c1: Counter, c2: Counter) -> Counter:
    c = Counter()
    for k1, v1 in c1.items():
        for k2, v2 in c2.items():
            c[k1 + k2] += v1 * v2
    return c


def _merge_tuples(t1: tuple[float, ...], t2: tuple[float, ...]) -> tuple[float, ...]:
    return tuple(x + y for x, y in zip(t1, t2))


def _merge_counters_keyed(c1: Counter, c2: Counter) -> Counter:
    c = Counter()
    for k1, v1 in c1.items():
        for k2, v2 in c2.items():
            c[_merge_tuples(k1, k2)] += v1 * v2
    return c


def question_choice_sum_expanded(question: model.Question) -> list[tuple[float, float]]:
    key_idx = {'x': 0, 'y': 1}
    result = []
    curr_idx = key_idx[question.impact_keys[0]]
    base = [0] * len(key_idx)
    for s in all_possible_sums_gen(question.selection_range.end, question.choice_scores):
        base[curr_idx] = s  # type: ignore
        result.append(tuple(base))
    return result  # type: ignore


def score_count_freq_keyed(questions: list[model.Question]) -> Counter:
    score_counters = [Counter(question_choice_sum_expanded(q)) for q in questions]
    score_counter = reduce(_merge_counters_keyed, score_counters)
    return score_counter


def score_count_freq(questions: list[model.Question]) -> Counter:
    """
    Return a Counter of the possible scores and their frequencies.
    :param questions: A list of questions.
    :return: A Counter of the possible scores and their frequencies.
    """
    score_counters = [Counter(all_possible_sums_gen(q.selection_range.end, q.choice_scores)) for q in questions]
    score_counter = reduce(_merge_counters, score_counters)
    return score_counter


def _score_count_df(counter: Counter) -> pd.DataFrame:
    """
    Return a DataFrame of the possible scores and their frequencies.
    :param counter: A Counter of the possible scores and their frequencies.
    :return: A DataFrame of the possible scores and their frequencies.
    """
    return pd.DataFrame({'score': counter.keys(), 'count': counter.values()})


def _score_count_df_keyed(counter: Counter) -> pd.DataFrame:
    """
    Return a DataFrame of the possible scores per impact key and their frequencies.
    :param counter: A Counter of the possible scores and their frequencies.
    :return: A DataFrame of the possible scores and their frequencies.
    """
    keys: list[tuple] = list(counter.keys())
    return pd.DataFrame({
        'score': [x + y for x, y in keys],
        'score_x': [x for x, _ in keys],
        'score_y': [y for _, y in keys],
        'count': counter.values()
    })


def _normalize_df(df: pd.DataFrame, columns: list[str]) -> pd.DataFrame:
    """
    Normalize the values in the given columns of the given DataFrame.
    :param df: the DataFrame to normalize
    :param columns: the columns to normalize
    :return: a copy of the DataFrame with the given columns normalized
    """
    df_copy = df.copy()
    df_copy[columns] -= df_copy[columns].min()
    df_copy[columns] /= df_copy[columns].max()
    return df_copy


def score_count_df(questions: list[model.Question], normalize: bool = False) -> pd.DataFrame:
    """
    Return a DataFrame of the possible scores and their frequencies.
    :param questions: A list of questions.
    :param normalize: Whether to normalize the values in the DataFrame.
    :return: A DataFrame of the possible scores and their frequencies.
    """
    absolute_df = _score_count_df(score_count_freq(questions))
    # sort by score and reset index
    absolute_df = absolute_df.sort_values('score').reset_index(drop=True)
    return _normalize_df(absolute_df, ['count']) if normalize else absolute_df


def score_count_df_keyed(questions: list[model.Question], normalize: bool = False) -> pd.DataFrame:
    """
    Return a DataFrame of the possible scores per impact key and their frequencies.
    :param questions: A list of questions.
    :param normalize: Whether to normalize the values in the DataFrame.
    :return: A DataFrame of the possible scores and their frequencies.
    """
    absolute_df = _score_count_df_keyed(score_count_freq_keyed(questions))
    # sort by score and reset index
    absolute_df = absolute_df.sort_values(['score']).reset_index(drop=True)
    return _normalize_df(absolute_df, ['count']) if normalize else absolute_df
