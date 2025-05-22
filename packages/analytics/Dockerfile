FROM python:3.13-slim-bookworm
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

COPY ./packages/analytics /app

RUN uv sync --locked
EXPOSE 2718
CMD ["/bin/sh", "-c", "uv run marimo run src/analytics.py --port 2718 --token --token-password \"$MARIMO_TOKEN_PASSWORD\""]