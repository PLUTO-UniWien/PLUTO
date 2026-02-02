# syntax=docker/dockerfile:1.6

FROM node:24-slim AS base

ENV NODE_ENV=production \
    STRAPI_TELEMETRY_DISABLED=true \
    PNPM_HOME="/pnpm" \
    COREPACK_HOME="/usr/local/share/corepack"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

WORKDIR /workspace

FROM base AS builder

# Native deps (e.g. better-sqlite3) may need a compiler toolchain on some platforms.
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Install only what the CMS needs (better layer caching).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/cms/package.json packages/cms/package.json
COPY packages/jwk-to-pem packages/jwk-to-pem
RUN pnpm config set store-dir /pnpm/store
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --filter cms --prod --frozen-lockfile

# Now copy the CMS source and build the admin bundle.
COPY packages/cms packages/cms
RUN pnpm --filter cms run build

FROM base AS runner

ENV HOME=/app

RUN addgroup --system --gid 1001 nodejs && \
    mkdir -p /app && \
    adduser --system --uid 1001 --gid 1001 --home /app --no-create-home strapi && \
    chown -R 1001:1001 /app

WORKDIR /app

COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/packages/cms ./packages/cms
COPY --from=builder /workspace/packages/jwk-to-pem ./packages/jwk-to-pem
COPY --from=builder /workspace/package.json ./package.json
COPY --from=builder /workspace/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /workspace/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Strapi writes to .tmp by default for sqlite and other runtime artifacts.
RUN mkdir -p /app/packages/cms/.tmp && \
    chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

WORKDIR /app/packages/cms

CMD ["pnpm", "exec", "strapi", "start"]
