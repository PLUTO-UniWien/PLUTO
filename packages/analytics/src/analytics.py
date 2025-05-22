import marimo

__generated_with = "0.13.11"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""# PLUTO Analytics""")
    return


@app.cell(hide_code=True)
def _(question_time_stats_df):
    question_time_stats_df.plot.bar(
        x="questionOrdinal:N",
        y="medianTimeSpent:Q",
    )
    return


@app.cell(hide_code=True)
def _(mo, os):
    def env(key: str) -> str:
        if key not in os.environ:
            raise ValueError(f"Environment variable {key} is not set.")
        return os.environ[key]

    try:
        STRAPI_API_TOKEN = env("STRAPI_API_TOKEN")
        STRAPI_API_BASE_URL = env("STRAPI_API_BASE_URL")
        UMAMI_BASE_URL = env("UMAMI_BASE_URL")
    except ValueError as e:
        mo.stop(
            True,
            output=mo.callout(
                "🚨 This dashboard is misconfigured. Please contact your administrator.",
                kind="danger",
            ),
        )
    return STRAPI_API_BASE_URL, STRAPI_API_TOKEN, UMAMI_BASE_URL


@app.cell(hide_code=True)
def _(
    STRAPI_API_BASE_URL,
    STRAPI_API_TOKEN,
    UMAMI_BASE_URL,
    construct_question_time_stats_df,
    construct_questions_df,
    construct_strapi_item_fetch_urls,
    duckdb,
    fetch_strapi_collection_size,
    issue_umami_api_token,
    load_submission_df,
    load_survey_df,
    mo,
    os,
):
    with mo.status.spinner(
        title="Preparing...", subtitle="📊 Connecting to Analytics"
    ) as _spinner:
        UMAMI_API_TOKEN = issue_umami_api_token(
            base_url=os.getenv("UMAMI_BASE_URL"),
            username=os.getenv("UMAMI_USERNAME"),
            password=os.getenv("UMAMI_PASSWORD"),
        )
        duckdb.execute(rf"""
        CREATE OR REPLACE SECRET umami_auth (
            TYPE http,
            BEARER_TOKEN '{UMAMI_API_TOKEN}',
            SCOPE '{UMAMI_BASE_URL}'
        );
        """)
        _spinner.update(title="Hang tight...", subtitle="📝 Connecting to CMS")
        duckdb.execute(rf"""
        CREATE OR REPLACE SECRET strapi_auth (
            TYPE http,
            BEARER_TOKEN '{STRAPI_API_TOKEN}',
            SCOPE '{STRAPI_API_BASE_URL}'
        );
        """)

        _spinner.update(subtitle="📋 Retrieving Survey")
        survey_fetch_url = (
            f"{STRAPI_API_BASE_URL}/survey?populate=groups.questions.choices"
        )
        survey_df = load_survey_df(survey_fetch_url)

        _spinner.update(
            title="Almost there...", subtitle="📥 Retrieving Survey Submissions"
        )
        submission_count = fetch_strapi_collection_size(
            base_url=STRAPI_API_BASE_URL,
            token=STRAPI_API_TOKEN,
            collection="submissions",
        )
        submission_item_fetch_urls = construct_strapi_item_fetch_urls(
            base_url=STRAPI_API_BASE_URL,
            collection="submissions",
            collection_size=submission_count,
            page_size=250,
        )
        submission_df = load_submission_df(submission_item_fetch_urls)

        _spinner.update("🛠️ Crunching Numbers")
        questions_df = construct_questions_df(survey_df)
        question_time_stats_df = construct_question_time_stats_df(
            submission_df=submission_df,
            questions_df=questions_df,
        )
    return (question_time_stats_df,)


@app.cell(hide_code=True)
def _(duckdb, pl):
    def load_submission_df(submission_item_fetch_urls: list[str]) -> pl.DataFrame:
        return duckdb.query(f"""
    from read_json({submission_item_fetch_urls})
    select data as submission
    """).pl()

    return (load_submission_df,)


@app.cell(hide_code=True)
def _(duckdb, pl):
    def load_survey_df(survey_fetch_url: str) -> pl.DataFrame:
        return duckdb.query(f"select data from read_json('{survey_fetch_url}')").pl()

    return (load_survey_df,)


@app.cell(hide_code=True)
def _(pl):
    def construct_questions_df(survey_df: pl.DataFrame) -> pl.DataFrame:
        return (
            survey_df.unnest("data")
            .explode("groups")
            .select("groups")
            .unnest("groups")
            .select("title", "questions")
            .rename({"title": "group"})
            .explode("questions")
            .unnest("questions")
            .rename({"id": "questionId", "body": "questionBody"})
            .with_row_index()
            .select(
                "group",
                (pl.col("index") + 1).alias("questionOrdinal"),
                "questionId",
                "questionBody",
                "choices",
            )
            .select(
                "group",
                "questionOrdinal",
                "questionId",
                "questionBody",
                "choices",
            )
        )

    return (construct_questions_df,)


@app.cell(hide_code=True)
def _(pl):
    def construct_question_time_stats_df(
        submission_df: pl.DataFrame,
        questions_df: pl.DataFrame,
    ) -> pl.DataFrame:
        return (
            submission_df.explode("submission")
            .unnest("submission")
            .select("items")
            .explode("items")
            .unnest("items")
            .with_columns(questionId=pl.col("question").struct.field("id"))
            .join(
                questions_df.select("questionId", "questionOrdinal", "questionBody"),
                on="questionId",
            )
            .group_by("questionOrdinal")
            .agg(
                pl.col("timeSpentOnQuestion").median().alias("medianTimeSpent"),
                pl.col("questionBody").first(),
            )
            .sort("questionOrdinal")
        )

    return (construct_question_time_stats_df,)


@app.cell(hide_code=True)
def _(urlencode):
    def construct_strapi_item_fetch_urls(
        base_url: str,
        collection: str,
        collection_size: int,
        page_size: int,
    ) -> list[str]:
        url = f"{base_url}/{collection}"
        return [
            f"{url}?{urlencode({'pagination[start]': i, 'pagination[limit]': page_size, 'populate': 'items.question.choices'})}"
            for i in range(0, collection_size, page_size)
        ]

    return (construct_strapi_item_fetch_urls,)


@app.cell(hide_code=True)
def _(httpx):
    def fetch_strapi_collection_size(
        base_url: str,
        token: str,
        collection: str,
    ) -> int:
        url = f"{base_url}/{collection}"
        response = httpx.get(
            url,
            params={"pagination[pageSize]": 1},
            headers={"Authorization": f"Bearer {token}"},
        )
        response.raise_for_status()
        return response.json()["meta"]["pagination"]["total"]

    return (fetch_strapi_collection_size,)


@app.cell(hide_code=True)
def _(httpx):
    def issue_umami_api_token(base_url: str, username: str, password: str) -> str:
        url = f"{base_url}/api/auth/login"
        response = httpx.post(url, json={"username": username, "password": password})
        response.raise_for_status()
        return response.json()["token"]

    return (issue_umami_api_token,)


@app.cell(hide_code=True)
def _():
    import os
    import marimo as mo
    import httpx
    import polars as pl
    from urllib.parse import urlencode, urljoin
    import duckdb

    return duckdb, httpx, mo, os, pl, urlencode


if __name__ == "__main__":
    app.run()
