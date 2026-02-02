# syntax=docker/dockerfile:1.6

FROM node:24-slim AS base

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /workspace

FROM base AS builder

# Install deps first (better layer caching).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/web/package.json packages/web/package.json
COPY packages/jwk-to-pem packages/jwk-to-pem
RUN pnpm config set store-dir /pnpm/store
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --filter web --frozen-lockfile

# Copy app source after installing deps.
COPY packages/web packages/web

# Mount secrets during build time so that we can perform full site pre-render at build time.
RUN --mount=type=secret,id=env_file,target=/workspace/packages/web/.env.local \
    pnpm --filter web run build

FROM base AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOME=/app

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    mkdir -p /app && \
    adduser --system --uid 1001 --gid 1001 --home /app --no-create-home nextjs && \
    chown -R 1001:1001 /app

WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder --chown=nextjs:nodejs /workspace/packages/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /workspace/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /workspace/packages/web/public ./packages/web/public

# Use the non-root user
USER nextjs

EXPOSE 3000
ENV PORT=3000

# Environment variables will be injected at runtime
CMD ["node", "packages/web/server.js"]
