FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS prod

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /workspace
COPY . /workspace
RUN pnpm install --filter cms --prod --frozen-lockfile
RUN pnpm --filter cms run build

EXPOSE 1337
CMD [ "pnpm", "--filter", "cms", "start" ]