import altair as alt
import pandas as pd

from pluto_survey_tools.model import Questionnaire
from pluto_survey_tools.stats.frequencies import score_count_df_keyed


def create_histo_heatmap(
    q1: Questionnaire,
    q2: Questionnaire,
    normalize: bool = True,
    with_zero_line: bool = True,
    width_heatmap: int = 650,
    height_heatmap: int = 650,
    size_histogram: int = 100,
    legendX: int = -150,
    legendY: int = 0,
    show_base: bool = True,
    show_edited: bool = False,
    scheme_base: str = "inferno",
    scheme_edited: str = "yellowgreenblue",
):
    df1 = score_count_df_keyed(q1.questions, normalize=normalize)
    df2 = score_count_df_keyed(q2.questions, normalize=normalize)
    return create_histo_heatmap_from_df(
        df1,
        df2,
        with_zero_line=with_zero_line,
        normalize=normalize,
        width_heatmap=width_heatmap,
        height_heatmap=height_heatmap,
        size_histogram=size_histogram,
        legendX=legendX,
        legendY=legendY,
        show_base=show_base,
        show_edited=show_edited,
        scheme_base=scheme_base,
        scheme_edited=scheme_edited,
    )


def create_histo_heatmap_from_df(
    df1: pd.DataFrame,
    df2: pd.DataFrame,
    with_zero_line: bool,
    normalize: bool,
    width_heatmap: int,
    height_heatmap: int,
    size_histogram: int,
    legendX: int,
    legendY: int,
    show_base: bool,
    show_edited: bool,
    scheme_base: str,
    scheme_edited: str,
):
    assert (
        show_base or show_edited
    ), "At least one of `show_base` or `show_edited` must be True"
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
    diff_mark_config = {
        "color": "yellow",
        "opacity": 0.25,
    }
    zero_line_config = {
        "color": "red",
        "strokeWidth": 1,
        "strokeDash": [5, 5],
    }

    frequency_title = ("Relative" if normalize else "Absolute") + " freq."
    tooltip_count_format = ".1%" if normalize else alt.Undefined

    def create_heatmap(df: pd.DataFrame, scheme: str, label: str):
        return (
            alt.Chart(df)
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
                    title=frequency_title,
                    scale=alt.Scale(scheme=scheme),
                    legend=alt.Legend(
                        orient="none", offset=0, legendX=legendX, legendY=legendY
                    ),
                ),
                tooltip=[
                    alt.Tooltip("score_x", title=f"Benefits ({label})"),
                    alt.Tooltip("score_y", title=f"Public value ({label})"),
                    alt.Tooltip(
                        "count",
                        title=f"{frequency_title} ({label})",
                        format=tooltip_count_format,
                    ),
                ],
            )
        )

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
                y=alt.Y("count:Q", title=frequency_title, axis=alt.Axis(labels=False)),
                tooltip=[
                    alt.Tooltip("score_x", title="Benefits"),
                    alt.Tooltip(
                        "count", title=frequency_title, format=tooltip_count_format
                    ),
                ],
            )
        )

    def create_histogram_y(df: pd.DataFrame, is_diff: bool = False):
        mark_config = diff_mark_config if is_diff else {}
        return (
            alt.Chart(df, width=size_histogram, height=height_heatmap)
            .mark_bar(**mark_config)
            .encode(
                x=alt.X("count:Q", title=frequency_title, axis=alt.Axis(labels=False)),
                y=alt.Y(
                    "score_y:O",
                    title=None,
                    sort="descending",
                    axis=alt.Axis(labelExpr=y_label_expr),
                    scale=alt.Scale(domain=domain_y),
                ),
                tooltip=[
                    alt.Tooltip("score_y", title="Public value"),
                    alt.Tooltip(
                        "count", title=frequency_title, format=tooltip_count_format
                    ),
                ],
            )
        )

    heatmap_base = create_heatmap(df=df1, scheme=scheme_base, label="Base")
    heatmap_edited = create_heatmap(df=df2, scheme=scheme_edited, label="Edited")
    if show_base and show_edited:
        heatmap = (heatmap_base + heatmap_edited).resolve_scale(color="independent")
        histX = create_histogram_x(df1) + create_histogram_x(df2, is_diff=True)
        histY = create_histogram_y(df1) + create_histogram_y(df2, is_diff=True)
    elif show_base:
        heatmap = heatmap_base
        histX = create_histogram_x(df1)
        histY = create_histogram_y(df1)
    elif show_edited:
        heatmap = heatmap_edited
        histX = create_histogram_x(df2)
        histY = create_histogram_y(df2)
    else:
        raise ValueError("At least one of `show_base` or `show_edited` must be True")

    heatmap = heatmap.properties(width=width_heatmap, height=height_heatmap)

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

    return histX & (heatmap | histY)
