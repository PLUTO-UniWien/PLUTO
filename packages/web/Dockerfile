# syntax=docker/dockerfile:1.4
FROM node:23-slim AS base

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder

WORKDIR /workspace
COPY . .

# Mount secrets during build time so that we can perform full site pre-render at build time
RUN --mount=type=secret,id=env_file,target=/workspace/packages/web/.env.local \
    pnpm install --filter web --frozen-lockfile && \
    pnpm --filter web run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Add a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

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