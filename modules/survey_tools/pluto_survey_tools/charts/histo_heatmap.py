import altair as alt
import pandas as pd

from pluto_survey_tools.model import Questionnaire
from pluto_survey_tools.stats.frequencies import score_count_df_keyed


def create_histo_heatmap(q1: Questionnaire, q2: Questionnaire, normalize: bool = True):
    df1 = score_count_df_keyed(q1.questions, normalize=normalize)
    df2 = score_count_df_keyed(q2.questions, normalize=normalize)
    return create_histo_heatmap_from_df(df1, df2, should_layer=q1 != q2)


def create_histo_heatmap_from_df(
    df1: pd.DataFrame,
    df2: pd.DataFrame,
    should_layer: bool,
    with_zero_line: bool = True,
):
    domain_x = list(sorted(pd.concat([df1["score_x"], df2["score_x"]]).unique()))
    if with_zero_line and domain_x[0] > 0:
        domain_x_min = 0
        domain_x_max = domain_x[-1]
        domain_x = list(range(domain_x_min, domain_x_max + 1))

    domain_y = list(
        sorted(pd.concat([df1["score_y"], df2["score_y"]]).unique(), reverse=True)
    )
    if with_zero_line and domain_y[-1] > 0:
        domain_y_min = 0
        domain_y_max = domain_y[0]
        domain_y = list(reversed(range(domain_y_min, domain_y_max + 1)))

    x_label_expr = "datum.value % 2 ? null : datum.label"
    y_label_expr = "datum.value % 1 ? null : datum.label"
    width_heatmap = 650
    height_heatmap = 650
    size_histogram = 100
    diff_mark_config = {
        "color": "yellow",
        "opacity": 0.25,
    }
    zero_line_config = {
        "color": "red",
        "strokeWidth": 1,
        "strokeDash": [5, 5],
    }

    heatmap = (
        alt.Chart(df1)
        .mark_rect()
        .encode(
            x=alt.X(
                "score_x:O",
                title="Benefits",
                sort="ascending",
                axis=alt.Axis(labelExpr=x_label_expr),
                scale=alt.Scale(domain=domain_x),
            ),
            y=alt.Y(
                "score_y:O",
                title="Public value",
                sort="descending",
                axis=alt.Axis(labelExpr=y_label_expr),
                scale=alt.Scale(domain=domain_y),
            ),
            color=alt.Color(
                "count:Q",
                title="Frequency",
                scale=alt.Scale(scheme="viridis"),
                legend=alt.Legend(orient="none", offset=0, legendX=-100, legendY=0),
            ),
            tooltip=["score_x", "score_y", "count"],
        )
    )

    if with_zero_line:

        def create_zero_line(*, x0: int, x1: int, y0: int, y1: int):
            return (
                alt.Chart(pd.DataFrame({"score_x": [x0, x1], "score_y": [y0, y1]}))
                .mark_line(**zero_line_config)
                .encode(x="score_x:O", y="score_y:O")
            )

        zero_line_x = create_zero_line(x0=domain_x[0], x1=domain_x[-1], y0=0, y1=0)
        zero_line_y = create_zero_line(x0=0, x1=0, y0=domain_y[0], y1=domain_y[-1])
        zero_lines = zero_line_x + zero_line_y
        heatmap = heatmap + zero_lines

    heatmap = heatmap.properties(width=width_heatmap, height=height_heatmap)

    def create_histogram_x(df: pd.DataFrame, is_diff: bool = False):
        mark_config = diff_mark_config if is_diff else {}
        return (
            alt.Chart(df, width=width_heatmap, height=size_histogram)
            .mark_bar(**mark_config)
            .encode(
                x=alt.X(
                    "score_x:O",
                    title=None,
                    axis=alt.Axis(labelExpr=x_label_expr),
                    scale=alt.Scale(domain=domain_x),
                ),
                y=alt.Y("count:Q", title="Frequency", axis=alt.Axis(labels=False)),
                tooltip=["score_x", "count"],
            )
        )

    def create_histogram_y(df: pd.DataFrame, is_diff: bool = False):
        mark_config = diff_mark_config if is_diff else {}
        return (
            alt.Chart(df, width=size_histogram, height=height_heatmap)
            .mark_bar(**mark_config)
            .encode(
                x=alt.X("count:Q", title="Frequency", axis=alt.Axis(labels=False)),
                y=alt.Y(
                    "score_y:O",
                    title=None,
                    sort="descending",
                    axis=alt.Axis(labelExpr=y_label_expr),
                    scale=alt.Scale(domain=domain_y),
                ),
                tooltip=["score_y", "count"],
            )
        )

    histX = create_histogram_x(df1)
    histY = create_histogram_y(df1)
    if should_layer:
        histX = histX + create_histogram_x(df2, is_diff=True)
        histY = histY + create_histogram_y(df2, is_diff=True)

    return histX & (heatmap | histY)
