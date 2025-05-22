import marimo

__generated_with = "0.13.11"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""# PLUTO Analytics""")
    return


@app.cell
def _(httpx):
    def umami_login(base_url: str, username: str, password: str) -> str:
        url = f"{base_url}/api/auth/login"
        response = httpx.post(url, json={"username": username, "password": password})
        response.raise_for_status()
        return response.json()["token"]

    return (umami_login,)


@app.cell
def _(os, umami_login):
    umami_token = umami_login(
        base_url=os.getenv("UMAMI_BASE_URL"),
        username=os.getenv("UMAMI_USERNAME"),
        password=os.getenv("UMAMI_PASSWORD"),
    )
    return


@app.cell(hide_code=True)
def _():
    import os

    import marimo as mo
    import httpx

    return httpx, mo, os


if __name__ == "__main__":
    app.run()
