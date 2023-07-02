import altair as alt
import pandas as pd

from survey_analysis.charts.utils import VEGA_LITE_COLOR_SCHEME_MAP
from survey_analysis.model import Questionnaire
from survey_analysis.stats.frequencies import normalize_df, score_count_df_keyed


def create_histo_heatmap(
    q1: Questionnaire,
    q2: Questionnaire,
    normalize: bool = True,
    with_zero_line: bool = True,
    width_heatmap: int = 650,
    height_heatmap: int = 650,
    size_histogram: int = 100,
    opacity_base: float = 1.0,
    opacity_edited: float = 0.5,
    show_base: bool = True,
    show_edited: bool = False,
    scheme_base: str = "plasma",
    scheme_edited: str = "bluegreen",
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
        opacity_base=opacity_base,
        opacity_edited=opacity_edited,
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
    opacity_base: float,
    opacity_edited: float,
    show_base: bool,
    show_edited: bool,
    scheme_base: str,
    scheme_edited: str,
):
    assert (
        show_base or show_edited
    ), "At least one of `show_base` or `show_edited` must be True"

    if show_base and show_edited:
        domain_dfs = [df1, df2]
    elif show_base:
        domain_dfs = [df1]
    else:
        domain_dfs = [df2]

    domain_x = list(sorted(pd.concat([df["score_x"] for df in domain_dfs]).unique()))
    domain_x_min = -1 if domain_x[0] > -1 else int(domain_x[0])
    domain_x_max = 1 if domain_x[-1] < 1 else int(domain_x[-1])
    domain_x = list(range(domain_x_min, domain_x_max + 1))

    domain_y = list(
        sorted(pd.concat([df["score_y"] for df in domain_dfs]).unique(), reverse=True)
    )
    domain_y_min = -1 if domain_y[-1] > -1 else int(domain_y[-1])
    domain_y_max = 1 if domain_y[0] < 1 else int(domain_y[0])
    domain_y = list(reversed(range(domain_y_min, domain_y_max + 1)))

    x_label_expr = "datum.value % 2 ? null : datum.label"
    y_label_expr = "datum.value % 1 ? null : datum.label"
    mark_config_base = {
        "color": VEGA_LITE_COLOR_SCHEME_MAP[scheme_base],
        "opacity": opacity_base / 2,
    }
    mark_config_edited = {
        "color": VEGA_LITE_COLOR_SCHEME_MAP[scheme_edited],
        "opacity": opacity_edited / 2,
    }
    zero_line_config = {
        "color": "red",
        "strokeWidth": 2,
        "strokeDash": [5, 5],
    }

    frequency_title = ("Relative" if normalize else "Absolute") + " freq."
    tooltip_count_format = ".1%" if normalize else alt.Undefined

    def create_heatmap(df: pd.DataFrame, scheme: str, label: str, opacity: float):
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
                    title=f"{frequency_title} ({label})",
                    scale=alt.Scale(scheme=scheme),
                    legend=alt.Legend(orient="left"),
                ),
                opacity=alt.value(opacity),
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

    def create_histogram_x(df: pd.DataFrame, mark_config: dict | None = None):
        if mark_config is None:
            mark_config = {}
        df_grouped = df.copy().groupby("score_x").sum().reset_index()
        if normalize:
            df_grouped = normalize_df(df_grouped, ["count"])
        return (
            alt.Chart(df_grouped, width=width_heatmap, height=size_histogram)
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

    def create_histogram_y(df: pd.DataFrame, mark_config: dict | None = None):
        if mark_config is None:
            mark_config = {}
        df_grouped = df.copy().groupby("score_y").sum().reset_index()
        if normalize:
            df_grouped = normalize_df(df_grouped, ["count"])
        return (
            alt.Chart(df_grouped, width=size_histogram, height=height_heatmap)
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

    heatmap_base = create_heatmap(
        df=df1, scheme=scheme_base, label="Base", opacity=opacity_base
    )
    heatmap_edited = create_heatmap(
        df=df2, scheme=scheme_edited, label="Edited", opacity=opacity_edited
    )
    histX_base = create_histogram_x(df1, mark_config=mark_config_base)
    histX_edited = create_histogram_x(df2, mark_config=mark_config_edited)
    histY_base = create_histogram_y(df1, mark_config=mark_config_base)
    histY_edited = create_histogram_y(df2, mark_config=mark_config_edited)
    if show_base and show_edited:
        heatmap = (
            (heatmap_base + heatmap_edited)
            .resolve_scale(color="independent")
            .resolve_legend(color="independent")
        )
        histX = histX_base + histX_edited
        histY = histY_base + histY_edited
    elif show_base:
        heatmap = heatmap_base
        histX = histX_base
        histY = histY_base
    elif show_edited:
        heatmap = heatmap_edited
        histX = histX_edited
        histY = histY_edited
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
