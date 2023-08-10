FROM pluto:nx-base AS builder
# The whole monorepo source is already copied under /app
WORKDIR /app

# produce a production build and output it to /app/dist
RUN nx run survey-admin:build

# Build node_modules with native deps on alpine
FROM node:18-alpine AS alpine-builder
ENV NODE_ENV=production

# Install build dependencies
RUN apk update && \
    apk add --no-cache python3 build-base

# Upgrade npm
RUN npm install -g npm@latest

WORKDIR /app
# Copy the built app from the builder image
COPY --from=builder /app/dist ./dist
# Install production dependencies in each module
RUN find dist -name "package.json" -maxdepth 3 -exec sh -c '(cd "$(dirname "{}")" && npm install)' \;

# Run the built app in a clean slim image
FROM node:18-alpine AS production
ENV NODE_ENV=production

WORKDIR /app
# Copy the built app from the builder image
COPY --from=alpine-builder /app .
# Install PM2 globally
RUN npm install -g pm2@latest
WORKDIR /app/dist/apps/survey-admin

# Remove each .env file to make sure that the system env vars are loaded
RUN find . -name ".env*" -exec rm -f {} \;

COPY ./apps/survey-admin/healthcheck.js /app
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
    CMD node /app/healthcheck.js

CMD ["pm2", "start", "ecosystem.config.js", "--no-daemon"]
