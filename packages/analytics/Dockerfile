# syntax=docker/dockerfile:1.6

FROM ghcr.io/astral-sh/uv:0.9.28 AS uv

FROM python:3.13-slim-bookworm AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_LINK_MODE=copy

WORKDIR /app

# Copy uv binaries into the builder image.
COPY --from=uv /uv /uvx /usr/local/bin/

# Install only runtime dependencies first (better layer caching).
COPY packages/analytics/pyproject.toml packages/analytics/uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-dev --no-install-project

# Copy only runtime code (avoid baking local .env files, request collections, etc.).
COPY packages/analytics/src ./src

FROM python:3.13-slim-bookworm AS runner

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    HOME=/app \
    PATH="/app/.venv/bin:$PATH"

RUN addgroup --system --gid 1001 app && \
    mkdir -p /app && \
    adduser --system --uid 1001 --gid 1001 --home /app --no-create-home app && \
    chown -R 1001:1001 /app

WORKDIR /app

COPY --from=builder --chown=1001:1001 /app /app

USER app

EXPOSE 2718

CMD ["/bin/sh", "-c", "marimo run src/analytics.py --host 0.0.0.0 --port 2718 --token --token-password \"$MARIMO_TOKEN_PASSWORD\""]
